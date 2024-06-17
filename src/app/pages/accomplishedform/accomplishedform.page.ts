import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accomplishedform',
  templateUrl: './accomplishedform.page.html',
  styleUrls: ['./accomplishedform.page.scss'],
})
export class AccomplishedformPage{

  dummyData = [
    {fileName: "NaturalDisaster1.docx", imgSrc: "assets/acc.png"},
    {fileName: "NaturalDisaster3.docx", imgSrc: "assets/acc.png"},
  ];

  deleteCard(index: number): void {
    // Remove the card at the specified index from the dummyData array
    this.dummyData.splice(index, 1);
  }

}
