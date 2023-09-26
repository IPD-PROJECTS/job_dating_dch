import { Injectable } from '@angular/core';
import Airtable from 'airtable';
import { environment } from 'src/environments/environment';

const { AIRTABLE_KEY, AIRTABLE_BASE_ID } = environment;
@Injectable({
  providedIn: 'root'
})
export class AirtableService {
  base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE_ID);
  constructor() { }

  registerUser(data: any) {
    return this.base('registered_users').create(data);
  }

  findEmail(email: any) {
    return this.base('registered_users').select({
      filterByFormula: `IF({email} = '${email}', TRUE(), FALSE())`
    }).all();
  }
}
