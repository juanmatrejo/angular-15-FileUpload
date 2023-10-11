import { Component } from '@angular/core';
import { PhotoDocument, UploadImagesService } from 'src/app/services/upload-images.service';

@Component({
	selector: 'app-photos',
	templateUrl: './photos.component.html',
	styles: [
	]
})
export class PhotosComponent {

	_cards: PhotoDocument[] = [];

	constructor(private _uploadImagesService: UploadImagesService) { }

	ngOnInit(): void {

		this._uploadImagesService.get().then((response: PhotoDocument[]) => this._cards = response);
	}
}
