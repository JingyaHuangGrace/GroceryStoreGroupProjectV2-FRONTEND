

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/models/contact.model';
import { StorageService } from 'src/app/_services/storage.service';
import { ContactService } from 'src/app/services/contact.service';
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
    contacts?: Contact[];
    currentContact: Contact = {};
    currentIndex = -1;
    name = '';
    contact: Contact = {
        first_name: '',
        last_name: '',
        contact_number: '',
        email_address: '',
        message: '',
    };
    submitted = false;

    private roles: string[] = [];
    isLoggedIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    username?: string;

    constructor(private contactService: ContactService,
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService) { }
    ngOnInit(): void {
        this.retrieveContacts();
        this.isLoggedIn = this.storageService.isLoggedIn();

        if (this.isLoggedIn) {
          const user = this.storageService.getUser();
          this.roles = user.roles;
          this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
          this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
          //this.username = user.username;
        }
    }
    saveContact(): void {
        if (!this.contact.first_name ||
            !this.contact.last_name ||
            !this.contact.contact_number ||
            !this.contact.email_address ||
            !this.contact.message) {
            alert("All five fields are mandatory!");
            return;
        }
        const data = {
            first_name: this.contact.first_name,
            last_name: this.contact.last_name,
            contact_number: this.contact.contact_number,
            email_address: this.contact.email_address,
            message: this.contact.message
        };
    
        this.contactService.create(data)
            .subscribe({
                next: (res) => {
                    console.log(res);
                    alert("The message was sent successfully!");

                },
                error: (e) => console.error(e)
            });
    }

    retrieveContacts(): void {
        this.contactService.getAll()
            .subscribe({
                next: (data) => {
                    this.contacts = data;
                    console.log(data);
                },
                error: (e) => console.error(e)
            });
    }
    refreshList(): void {
        this.retrieveContacts();
        this.currentContact = {};
        this.currentIndex = -1;
    }
    setActiveContact(contact: Contact, index: number): void {
        this.currentContact = contact;
        this.currentIndex = index;
    }
    removeAllContacts(): void {
        this.contactService.deleteAll()
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.refreshList();
                },
                error: (e) => console.error(e)
            });
    }
    searchName(): void {
        this.currentContact = {};
        this.currentIndex = -1;
        this.contactService.findByName(this.name)
            .subscribe({
                next: (data: Contact[] | undefined) => {
                    this.contacts = data;
                    console.log(data);
                },
                error: (e: any) => console.error(e)
            });
    }

    onSubmit(): void {
        this.saveContact()

    }
}

