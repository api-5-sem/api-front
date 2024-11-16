import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal-export',
    templateUrl: './modal-export.component.html',
    styleUrls: ['./modal-export.component.scss']
})
export class ModalExportComponent implements OnInit {
    idx: number;
    tipo: string;
    type: string

    constructor(private activeModal: NgbActiveModal) { }

    ngOnInit(): void {
    }

    share() {
        const data = JSON.parse(sessionStorage.getItem(this.tipo + this.idx))
        console.log(this.type, data, sessionStorage.getItem(this.tipo + this.idx));
    }

    close() {
        this.activeModal.close();
    }
}
