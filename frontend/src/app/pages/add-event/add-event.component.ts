import { Component, OnInit,ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})

export class AddEventComponent implements OnInit {

  eventType: any;
  isChecked: boolean = true;
  today=new Date();
  addEvent!: HTMLElement;
  

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.addEvent = this.el.nativeElement.querySelector("#addEvent");
  }

  
  hideAddEvent() {
    this.addEvent.classList.remove("w3-show");
    this.addEvent.classList.add("w3-hide");
  }

  submit(event: any) {
    console.log("form submitted ",event);
  }
}
