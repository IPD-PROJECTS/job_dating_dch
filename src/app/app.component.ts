import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';

import { AirtableService } from './services/airtable/airtable.service';
import { FirebaseService } from './services/firebase/firebase.service';
import { getNewFilename } from './utils';
import { FileUpload } from 'primeng/fileupload';

const MAX_FILE_SIZE = 4 * 1000000; // 4Mb
export enum ResidenceChoice {
  SENEGAL = 'Senegal',
  ETRANGER = 'Etranger',
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  MAX_UPLOADED_FILE_SIZE = MAX_FILE_SIZE;
  registerForm: FormGroup = new FormGroup({});
  residenceChoices = [ResidenceChoice.SENEGAL, ResidenceChoice.ETRANGER];
  isSubmitting = false;
  isChecking = false;
  errorMsg: string | null = null;
  selectedCVFile?: File;
  @ViewChild('fileUploader') fileUploader?: FileUpload;
  constructor(private fb: FormBuilder, private airtableService: AirtableService, private messageService: MessageService, private firebaseService: FirebaseService) {
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required, Validators.maxLength(50)]],
      lastname: [null, [Validators.required]],
      residence: [ResidenceChoice.SENEGAL, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required]],
      cvFile: [],
      cvFileUrl: [],
    });
  }

  ngOnInit(): void {}
  async onSubmit() {
    this.registerForm.markAllAsTouched();
    this.errorMsg = null;
    if (this.registerForm.valid) {
      const value = this.registerForm.value;
      if(!this.selectedCVFile) {
        this.registerForm.get('cvFile')?.setErrors({required: 'Veuillez charger votre CV'});
      } else {
        const emailAlreadyRegistered = await this.checkIfEmailAlreadyExist(value.email);
        if (!emailAlreadyRegistered) {
           await this.uploadCV();
           this.isSubmitting = true;
           try {
             await this.airtableService.registerUser(this.registerForm.value);
             this.isSubmitting = false;
             this.displayToastMsg('Vous avez bien été enregistré', true);
             this.clearAll();
           } catch (error) {
             this.errorMsg = "Une erreur s'est produite. Veuillez reessayer";
             this.isSubmitting = false;
             this.displayToastMsg("Veuillez nous excuser, une erreur s'est produite. Veuillez réessayé ", false);
           }

        } else {
          this.registerForm.get('email')?.setErrors({emailAlreadyExist: 'Cet email est déjà enregistré'});
          this.displayToastMsg("L'email que vous avez renseigné a déjà été utilisé", false);
        }

      }

    } else {
      this.errorMsg = 'Veuillez remplir correctement le formulaire';
    }
  }

  async checkIfEmailAlreadyExist(email: string) {
    let result: any = [];
    this.isChecking = true;
    try {
      result = await this.airtableService.findEmail(email);
      result = !!result.length;
    } catch (error) {
      result = false;

    }
    this.isChecking = false;
    return result;
  }

  displayToastMsg(message: string, success: boolean) {
    if (success) {
      this.messageService.add({severity: 'success', summary: 'Succés', detail: message});
    } else {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: message});
    }
  }

  onFileSelected(event: any) {
    this.registerForm.get('cvFile')?.setErrors(null);
    const {currentFiles} = event;
    this.selectedCVFile = currentFiles?.length ? currentFiles[0] : null;
  }

  async uploadCV() {
    if(this.selectedCVFile) {
      const newFileName = getNewFilename(this.selectedCVFile);
      this.isChecking = true;
      try {
        const response = await this.firebaseService.uploadFile(this.selectedCVFile, newFileName);
        const externalFileUrl = this.firebaseService.getDownloadUrl(response.metadata.fullPath);
        this.registerForm.get('cvFile')?.patchValue([{url: externalFileUrl}]);
        this.registerForm.get('cvFileUrl')?.patchValue(externalFileUrl);
      } catch (error) {

      }
      this.isChecking = false;
    }
  }

  clearAll() {
    this.fileUploader?.clear();
    this.registerForm.reset();
    this.selectedCVFile = undefined;
  }
}
