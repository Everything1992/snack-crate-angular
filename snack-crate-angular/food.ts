import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

// --- Product Data Mock (Simulating products.json) ---
interface Product {
    id: number;
    shortName: string;
    longDescription: string;
    unitSize: string;
    price: number; // Stored as a number
}

const PRODUCTS_DATA: Product[] = [
    {
        id: 1,
        shortName: 'Cherry Choc',
        longDescription: 'Dried cherry pieces covered with dark chocolate',
        unitSize: '2.4 oz',
        price: 2.30, 
    },
    {
        id: 2,
        shortName: 'Mixed Nuts',
        longDescription: 'Organic mixed nuts lightly salted',
        unitSize: '5.0 oz',
        price: 4.89, 
    },
    {
        id: 3,
        shortName: 'Dry Fruits',
        longDescription: 'Mix of different dry fruits',
        unitSize: '1.2 oz',
        price: 1.25, 
    },
    {
        id: 4,
        shortName: 'Honey Almond',
        longDescription: 'Organic honey roasted almonds',
        unitSize: '2.4 oz',
        price: 3.50, 
    },
    {
        id: 5,
        shortName: 'Big Pops',
        longDescription: 'Big bags of organic popcorn - different flavors',
        unitSize: '24 oz',
        price: 4.65, 
    }
];


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    template: `
        <div class="min-h-screen bg-stone-50 font-sans">
            
            <!-- Navigation Bar - Soft Pink (pink-300) -->
            <nav class="bg-pink-300 p-4 shadow-xl sticky top-0 z-10">
                <div class="max-w-7xl mx-auto flex justify-between items-center">
                    <span class="text-2xl font-extrabold text-pink-800 tracking-wider">The Snack Crate</span>
                    <div class="flex space-x-6">
                        <button
                            *ngFor="let page of pages"
                            (click)="changePage(page.key)"
                            [ngClass]="currentPage() === page.key ?
                                'text-pink-800 border-b-2 border-pink-800 font-bold px-2 py-1 uppercase text-sm md:text-base' :
                                'text-pink-100 hover:text-pink-800 transition px-2 py-1 uppercase text-sm md:text-base'"
                        >
                            {{ page.label }}
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Main Content Container -->
            <main class="max-w-4xl mx-auto p-6 md:p-10">

                <!-- Home Page -->
                <section *ngIf="currentPage() === 'home'" class="text-center py-12 bg-white rounded-xl shadow-lg border-t-4 border-pink-400">
                    <h1 class="text-4xl md:text-5xl font-extrabold text-pink-800 mb-6">
                        Welcome to The Snack Crate
                    </h1>
                    <p class="text-lg text-stone-700 max-w-2xl mx-auto mb-6">
                        We specialize in providing the highest quality selection of gourmet nuts, chewy dried fruits, and premium popcorn kernels. From the perfect movie night treat to nutritious, satisfying snacks, we source the best ingredients to bring nature's goodness right to your table.
                    </p>
                    <p class="text-lg text-stone-700 max-w-2xl mx-auto mb-8">
                        Explore our curated offerings on the <strong>Products</strong> page, or reach out directly to our team via the <strong>Contact</strong> page for wholesale inquiries or special requests. Your next favorite snack is waiting!
                    </p>
                    <div class="space-x-4">
                        <button (click)="changePage('products')" class="bg-emerald-300 hover:bg-emerald-400 text-pink-800 font-semibold py-3 px-8 rounded-full shadow-md transition duration-300">
                            Browse Products
                        </button>
                        <button (click)="changePage('contact')" class="bg-pink-100 hover:bg-pink-200 text-pink-800 font-semibold py-3 px-8 rounded-full shadow-md transition duration-300">
                            Contact Us
                        </button>
                    </div>
                </section>

                <!-- Products Page -->
                <section *ngIf="currentPage() === 'products'">
                    <h1 class="text-3xl font-bold text-pink-800 mb-8 border-b pb-2">Our Gourmet Selection</h1>
                    <div class="grid md:grid-cols-2 gap-8">
                        <article *ngFor="let product of products; trackBy: trackByProductId" class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 border-l-4 border-emerald-300">
                            <h3 class="text-2xl font-extrabold text-pink-800 mb-2">
                                {{ product.shortName }}
                            </h3>
                            <p class="text-stone-600 mb-3 border-b pb-3 text-sm italic">
                                {{ product.longDescription }}
                            </p>
                            <div class="flex justify-between items-center mt-2">
                                <p class="text-sm font-medium text-stone-500">
                                    <span class="font-semibold text-pink-700">Size:</span> {{ product.unitSize }}
                                </p>
                                <p class="text-xl font-bold text-red-700">
                                    {{ product.price | currency:'USD' }}
                                </p>
                            </div>
                        </article>
                    </div>
                </section>

                <!-- Contact Page -->
                <section *ngIf="currentPage() === 'contact'">
                    <h1 class="text-3xl font-bold text-pink-800 mb-8">Get In Touch</h1>
                    
                    <div class="bg-white p-8 rounded-xl shadow-lg border-t-4 border-pink-400">
                        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
                            
                            <!-- Full Name Field -->
                            <div>
                                <label for="fullName" class="block text-sm font-medium text-stone-700">Full Name</label>
                                <input id="fullName" type="text" formControlName="fullName"
                                    class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-pink-400 focus:border-pink-400"
                                    [ngClass]="fullNameControl.invalid && fullNameControl.touched ? 'border-red-500' : 'border-gray-300'"
                                    placeholder="Your full name"
                                >
                                <p *ngIf="fullNameControl.errors && fullNameControl.touched" class="mt-1 text-xs text-red-600">
                                    <span *ngIf="fullNameControl.errors?.['required']">Full Name is required.</span>
                                    <span *ngIf="fullNameControl.errors?.['minlength']">Full Name must be at least 5 characters.</span>
                                </p>
                            </div>

                            <!-- Email Address Field -->
                            <div>
                                <label for="email" class="block text-sm font-medium text-stone-700">Email Address</label>
                                <input id="email" type="email" formControlName="email"
                                    class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-pink-400 focus:border-pink-400"
                                    [ngClass]="emailControl.invalid && emailControl.touched ? 'border-red-500' : 'border-gray-300'"
                                    placeholder="name@example.com"
                                >
                                <p *ngIf="emailControl.errors && emailControl.touched" class="mt-1 text-xs text-red-600">
                                    <span *ngIf="emailControl.errors?.['required']">Email is required.</span>
                                    <span *ngIf="emailControl.errors?.['email']">Please enter a valid email address.</span>
                                </p>
                            </div>

                            <!-- Message Field -->
                            <div>
                                <label for="message" class="block text-sm font-medium text-stone-700">Message</label>
                                <textarea id="message" formControlName="message" rows="4"
                                    class="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-pink-400 focus:border-pink-400"
                                    [ngClass]="messageControl.invalid && messageControl.touched ? 'border-red-500' : 'border-gray-300'"
                                    placeholder="How can we help you?"
                                ></textarea>
                                <p *ngIf="messageControl.errors && messageControl.touched" class="mt-1 text-xs text-red-600">
                                    Message is required.
                                </p>
                            </div>

                            <button type="submit" [disabled]="contactForm.invalid"
                                class="w-full py-3 px-4 rounded-lg font-semibold transition duration-300"
                                [ngClass]="contactForm.invalid ? 'bg-pink-100 text-pink-500 cursor-not-allowed' : 'bg-emerald-300 hover:bg-emerald-400 text-pink-800 shadow-md'"
                            >
                                Send Inquiry
                            </button>
                        </form>
                    </div>

                    <!-- Form Submission Confirmation (Smaller font-size as requested) -->
                    <section *ngIf="submittedData()" class="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        <h2 class="text-base font-bold text-green-700 mb-2">Form submitted successfully!</h2>
                        <p>Thank yourself for reaching out. Here is a summary of the information you sent:</p>
                        <ul class="list-disc list-inside mt-2 space-y-1">
                            <li><span class="font-medium">Name:</span> {{ submittedData().fullName }}</li>
                            <li><span class="font-medium">Email:</span> {{ submittedData().email }}</li>
                            <li><span class="font-medium">Message:</span> {{ submittedData().message }}</li>
                        </ul>
                    </section>
                </section>

            </main>
        </div>
    `,
    styles: `
        .font-sans {
                font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }
    `,
})
export class App {
    // Navigation State
    currentPage = signal<'home' | 'products' | 'contact'>('home');
    pages = [
        { key: 'home', label: 'Home' },
        { key: 'products', label: 'Products' },
        { key: 'contact', label: 'Contact' },
    ];

    // Product Data
    products = PRODUCTS_DATA;
    
    // Dependency Injection using the inject function (Modern Angular Standalone practice)
    private fb = inject(FormBuilder);

    // Contact Form Setup (Reactive Forms)
    contactForm!: FormGroup;
    submittedData = signal<any>(null);

    constructor() {
        this.contactForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(5)]],
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required]],
        });
    }

    /** Returns the fullName FormControl instance, guaranteed to exist. */
    get fullNameControl(): FormControl {
        return this.contactForm.get('fullName') as FormControl;
    }

    /** Returns the email FormControl instance, guaranteed to exist. */
    get emailControl(): FormControl {
        return this.contactForm.get('email') as FormControl;
    }

    /** Returns the message FormControl instance, guaranteed to exist. */
    get messageControl(): FormControl {
        return this.contactForm.get('message') as FormControl;
    }

    changePage(page: 'home' | 'products' | 'contact') {
        this.currentPage.set(page);
        if (page !== 'contact') {
            this.submittedData.set(null);
        } else {
            this.contactForm.reset();
            this.contactForm.markAsPristine();
            this.contactForm.markAsUntouched();
            Object.keys(this.contactForm.controls).forEach(key => {
                this.contactForm.get(key)?.updateValueAndValidity();
            });
        }
    }

    onSubmit() {
        if (this.contactForm.valid) {
            this.submittedData.set(this.contactForm.value);
            this.contactForm.reset();
            Object.keys(this.contactForm.controls).forEach(key => {
                this.contactForm.get(key)?.setErrors(null);
                this.contactForm.get(key)?.markAsPristine();
                this.contactForm.get(key)?.markAsUntouched();
            });
            console.log('Form Submitted:', this.submittedData());
        } else {
            this.contactForm.markAllAsTouched();
        }
    }

    trackByProductId(index: number, item: Product) {
        return item.id;
    }
}