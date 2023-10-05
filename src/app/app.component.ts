import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';

import { AirtableService } from './services/airtable/airtable.service';
import { FirebaseService } from './services/firebase/firebase.service';
import { FAQ_LIST, LIST_METIER, getNewFilename } from './utils';
import { FileUpload } from 'primeng/fileupload';

const MAX_FILE_SIZE = 4 * 1000000; // 4Mb
enum ResidenceChoice {
  SENEGAL = 'Senegal',
  INTERNATIONAL = 'International',
}

enum SEXE {
  HOMME = 'Homme',
  FEMME = 'Femme'
}
enum DIPLOME {
  BAC = 'Bac',
  LICENCE = 'Licence',
  MASTER = 'Master',
  THESE = 'Thèse',
  POST_DOC = 'Post Doc'
}

enum YEARS_EXPERIENCE {
  MOINS_DE_3 = 'Moins de 3 ans',
  ENTRE_3_ET_10 = '3 à 10 ans',
  PLUS_DE_10 = 'Plus de 10 ans'
}

enum JOURNEE_SALON {
  JOUR_1 = 'Jour 1',
  JOUR_2 = 'Jour 2',
  JOUR_3 = 'Jour 3'
}

enum LANGUAGES {
  FRANCAIS = 'Français',
  ENGLAIS = 'Anglais'
}
const REGISTRATION_SUCCESS_TOAST_MSG = "Vous avez bien été enregistré pour l'événement. Une notification vous sera envoyé par email.";
const REGISTRATION_FAILED_TOAST_MSG = "Veuillez nous excuser, une erreur s'est produite. Veuillez réessayer ultérieurement";
const EMAIL_ALREADY_USED_ERROR_TOAST_MSG = "L'email que vous avez renseigné a déjà été utilisé";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  MAX_UPLOADED_FILE_SIZE = MAX_FILE_SIZE;
  registerForm: FormGroup = new FormGroup({});
  residenceChoices = [ResidenceChoice.SENEGAL, ResidenceChoice.INTERNATIONAL];
  sexe_choices = [SEXE.FEMME, SEXE.HOMME];
  diplomes_choices = [DIPLOME.BAC, DIPLOME.LICENCE, DIPLOME.MASTER, DIPLOME.THESE,  DIPLOME.POST_DOC];
  years_experience_choices = [YEARS_EXPERIENCE.MOINS_DE_3, YEARS_EXPERIENCE.ENTRE_3_ET_10, YEARS_EXPERIENCE.PLUS_DE_10]
  journees_choices = [JOURNEE_SALON.JOUR_1, JOURNEE_SALON.JOUR_2, JOURNEE_SALON.JOUR_3];
  list_metiers = LIST_METIER;
  list_languages = [LANGUAGES.FRANCAIS, LANGUAGES.ENGLAIS]
  JOURNEE_SALON = JOURNEE_SALON;
  YEARS_EXPERIENCE = YEARS_EXPERIENCE;
  isSubmitting = false;
  isChecking = false;
  errorMsg: string | null = null;
  selectedCVFile?: File;
  selectedCVFileUploaded = false;
  listFAQ = FAQ_LIST;
  @ViewChild('fileUploader') fileUploader?: FileUpload;
  constructor(private fb: FormBuilder, private airtableService: AirtableService, private messageService: MessageService, private firebaseService: FirebaseService) {
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required, Validators.maxLength(50)]],
      lastname: [null, [Validators.required]],
      sexe: [null, [Validators.required]],
      residence: [null, [Validators.required]],
      experience: [null, [Validators.required]],
      journee: [null, [Validators.required]],
      diplome: [null, [Validators.required]],
      metier: [null, [Validators.required]],
      languesMaitrisees: [null, [Validators.required]],
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
             this.displayToastMsg(REGISTRATION_SUCCESS_TOAST_MSG, true);
             this.clearAll();
           } catch (error) {
             this.errorMsg = "Une erreur s'est produite. Veuillez reessayer";
             this.isSubmitting = false;
             this.displayToastMsg(REGISTRATION_FAILED_TOAST_MSG, false);
           }

        } else {
          this.registerForm.get('email')?.setErrors({emailAlreadyExist: 'Cet email est déjà enregistré'});
          this.displayToastMsg(EMAIL_ALREADY_USED_ERROR_TOAST_MSG, false);
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
    this.selectedCVFileUploaded = false;
  }

  async uploadCV() {
    if(this.selectedCVFile && !this.selectedCVFileUploaded) {
      const newFileName = getNewFilename(this.selectedCVFile);
      this.isChecking = true;
      try {
        const response = await this.firebaseService.uploadFile(this.selectedCVFile, newFileName);
        const externalFileUrl = this.firebaseService.getDownloadUrl(response.metadata.fullPath);
        this.registerForm.get('cvFile')?.patchValue([{url: externalFileUrl}]);
        this.registerForm.get('cvFileUrl')?.patchValue(externalFileUrl);
        this.selectedCVFileUploaded = true;
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

  onProgrammeSelected(event: any) {
    const selectedValue = event?.value;
    if(this.registerForm.controls['experience'].value === YEARS_EXPERIENCE.MOINS_DE_3 && selectedValue === JOURNEE_SALON.JOUR_2) {
      this.registerForm.controls['journee'].setErrors({ invalidProgram: "Suivant le niveau d'expérience renseigné, vous n'êtes pas encore éligible pour cette journée. Veuillez sélectionner une autre journée, s'il vous plaît." })
    }
  }

  onExperienceSelected(event: any) {
    const selectedValue = event.value;
    this.registerForm.controls['journee'].setErrors(null);
    if(this.registerForm.controls['journee'].value === JOURNEE_SALON.JOUR_2 && selectedValue === YEARS_EXPERIENCE.MOINS_DE_3) {
      this.registerForm.controls['journee'].setErrors({ invalidProgram: "Suivant le niveau d'expérience renseigné, vous n'êtes pas encore éligible pour cette journée. Veuillez sélectionner une autre journée, s'il vous plaît." })
    }
  }


}
