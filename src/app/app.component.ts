import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AirtableService} from './services/airtable.service';
import {MessageService} from 'primeng/api';

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
  registerForm: FormGroup = new FormGroup({});
  residenceChoices = [ResidenceChoice.SENEGAL, ResidenceChoice.ETRANGER];
  isSubmitting = false;
  errorMsg: string | null = null;
  constructor(private fb: FormBuilder, private airtableService: AirtableService, private messageService: MessageService) {
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required, Validators.maxLength(50)]],
      lastname: [null, [Validators.required]],
      residence: [ResidenceChoice.SENEGAL, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required]],
      cvFile: [],
    });
  }

  ngOnInit(): void {}
  async onSubmit() {
    this.registerForm.markAllAsTouched();
    this.errorMsg = null;
    if (this.registerForm.valid) {
      const value = this.registerForm.value;
      const emailAlreadyRegistered = await this.checkIfEmailAlreadyExist(value.email);

      if (!emailAlreadyRegistered) {
        this.isSubmitting = true;
        try {
          await this.airtableService.registerUser(value);
          this.isSubmitting = false;
          this.displayToastMsg('Vous avez bien été enregistré', true);
          this.registerForm.reset();
        } catch (error) {
          this.errorMsg = "Une erreur s'est produite. Veuillez reessayer";
          this.isSubmitting = false;
          this.displayToastMsg("Veuillez nous excuser, une erreur s'est produite. Veuillez réessayé ", false);
        }
      } else {
        this.registerForm.get('email')?.setErrors({emailAlreadyExist: 'Cet email est déjà enregistré'});
        this.displayToastMsg("L'email que vous avez renseigné a déjà été utilisé", false);
      }
    } else {
      this.errorMsg = 'Veuillez remplir correctement le formulaire';
    }
  }

  async checkIfEmailAlreadyExist(email: string) {
    let result: any = [];
    try {
      result = await this.airtableService.findEmail(email);
      result = !!result.length;
    } catch (error) {
      result = false;
    }

    return result;
  }

  displayToastMsg(message: string, success: boolean) {
    if (success) {
      this.messageService.add({severity: 'success', summary: 'Succés', detail: message});
    } else {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: message});
    }
  }
}
