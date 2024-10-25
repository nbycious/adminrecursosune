import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private storage: Storage) {}

  async uploadImage(file: File, path: string): Promise<string> {
    try {
      // Crear una referencia única para la imagen usando timestamp
      const timestamp = new Date().getTime();
      const filePath = `${path}/${timestamp}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      
      // Subir el archivo
      const snapshot = await uploadBytes(storageRef, file);
      
      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }
}