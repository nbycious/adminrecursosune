import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  constructor() { }
  fileToUpload: File | null = null;
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}
uploadFileToActivity() {
 /*this.inputService.postFile(this.fileToUpload).subscribe(data => {
    // do something, if upload success
    }, error => {
      console.log(error);
    });*/
}

  ngOnInit(): void {
  }

}
