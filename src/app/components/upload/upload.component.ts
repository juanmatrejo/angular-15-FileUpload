import { Component } from '@angular/core';
import { FileItem } from 'src/app/models/file-item';
import { UploadImagesService } from 'src/app/services/upload-images.service';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styles: [
	]
})
export class UploadComponent {

	_images: FileItem[] = [];
	_isOver: boolean = false;

	constructor(private _uploadImagesService: UploadImagesService) { }

	uploadImages(): void {

		this._uploadImagesService.uploadImages(this._images);
	}

	cleanFiles() {

		this._images = [];
	}
}
