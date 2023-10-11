import { Inject, Injectable } from '@angular/core';
import { FileItem } from '../models/file-item';
import { CollectionReference, Firestore, QuerySnapshot, addDoc, collection, getDocs } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, StorageError, StorageReference, uploadBytesResumable, UploadTask, UploadTaskSnapshot } from '@angular/fire/storage';

export interface PhotoDocument { name: string; url: string; }

@Injectable({
	providedIn: 'root'
})
export class UploadImagesService {

	private _folder = '/Photos/';

	constructor(private _firestore: Firestore = Inject(Firestore)) { }

	uploadImages(images: FileItem[]) {

		const storage = getStorage();

		for (let image of images) {

			image.isUploading = true;
			if (image.progress >= 100) {
				continue;
			}

			const storageReference: StorageReference = ref(storage, `${this._folder}${image.name}`);

			const uploadTask: UploadTask = uploadBytesResumable(storageReference, image.file);

			uploadTask.on('state_changed',
				(snapshot: UploadTaskSnapshot) =>
					image.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
				(error: StorageError) => console.log('Error uploading ', error),
				() => {

					getDownloadURL(storageReference).then(url => {

						console.log('File uploaded successfully.');
						image.isUploading = false;
						image.url = url;

						const photoCollection = collection(this._firestore, this._folder);
						addDoc(photoCollection, {

							name: image.name,
							url: image.url
						});
					});
				});
		}
	}

	async get(): Promise<PhotoDocument[]> {

		const cardCollection: CollectionReference<PhotoDocument> = collection(this._firestore, this._folder) as CollectionReference<PhotoDocument>;
		const querySnapshot: QuerySnapshot<PhotoDocument> = await getDocs(cardCollection);

		const response: PhotoDocument[] = [];
		querySnapshot.forEach(doc =>

			response.push({ name: doc.data().name, url: doc.data().url })
		);

		return response;
	}
}
