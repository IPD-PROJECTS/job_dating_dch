import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { FirebaseStorage, StorageReference, getStorage, ref, uploadBytes } from "firebase/storage";
import { environment } from 'src/environments/environment.development';


const {  FIREBASE_CONFIG } = environment;

const UPLOADED_CV_FOLDER_NAME = 'uploaded_cv';
const DOWNLOAD_FILE_URL = 'https://storage.googleapis.com'
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app = initializeApp(FIREBASE_CONFIG);

  // Initialize Cloud Storage and get a reference to the service
  storage: FirebaseStorage = getStorage(this.app);
  constructor() { }

  uploadFile(file: File, newFileName: string) {
    const fileRef = ref(this.storage, `${UPLOADED_CV_FOLDER_NAME}/${newFileName}`);
    return uploadBytes(fileRef, file);
  }

  getDownloadUrl(fileFullPath: string) {
    return `${DOWNLOAD_FILE_URL}/${FIREBASE_CONFIG.storageBucket}/${fileFullPath}`
  }
}
