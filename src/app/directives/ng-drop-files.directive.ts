import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
	selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

	@Input() _files: FileItem[] = [];
	@Output() _mouseOver: EventEmitter<boolean> = new EventEmitter();

	constructor() { }

	@HostListener('dragover', ['$event'])
	public onDragOver(event: any) {

		this.preventStop(event);
		this._mouseOver.emit(true);
	}

	@HostListener('dragleave', ['$event'])
	public onDragLeave(event: any) {

		this._mouseOver.emit(false);
	}

	@HostListener('drop', ['$event'])
	public onDrop(event: any) {

		const transfer = this.getTransfer(event);

		if (!transfer) { return; }

		this.extractFiles(transfer.files);
		this.preventStop(event);
		this._mouseOver.emit(false);
	}

	private getTransfer(event: any) {

		return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
	}

	private extractFiles(fileList: FileList) {

		for (let fileDropped in fileList) {

			const tempFile = fileList[fileDropped];

			if (this.canBeDropped(tempFile)) {

				const newFile = new FileItem(tempFile);
				this._files.push(newFile);
			}
		}
	}

	private preventStop(event: any) {

		event.preventDefault();
		event.stopPropagation();
	}

	private canBeDropped(file: File): boolean {

		if (!this.fileDropped(file.name) && this.isImage(file.type)) {

			return true;
		}
		else {

			return false;
		}
	}

	private fileDropped(fileName: string) {

		for (let name of this._files) {

			if (name.name == fileName) {

				return true;
			}
		}

		return false;
	}

	private isImage(fileType: string): boolean {

		return (fileType === '' || fileType === undefined) ? false : fileType.startsWith('image');
	}
}
