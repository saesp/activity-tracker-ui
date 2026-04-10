import { Component } from '@angular/core';
import { ActivityService } from './services/activity.service';
import { CategoryService } from './services/category.service';
import { CommonModule, DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { Activity, ActivityCreate, ActivityUpdate } from './models/activity.model';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from './models/category.model';
import { NgForm } from '@angular/forms';


// componente principale:
// -richiama il service
// -gestisce i dati ricevuti
// -li espone alla view

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private activityService = inject(ActivityService);
  private categoryService = inject(CategoryService);

  //feedback for create, update and delete
  showMessage(msg: string, type: 'success' | 'error' = 'success') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  constructor() { }

  // ACTIVITIES

  // === VIEW ===
  activities$!: Observable<Activity[]>;
  loadActivities() {
    this.activities$ = this.activityService.getActivities();
  }
  ngOnInit() {
    this.loadActivities();
    this.loadCategories();
  }


  // === CREATE + UPDATE ===

  //null = create mode, Value = edit mode
  editingActivity: ActivityUpdate | null = null;

  loading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';


  //Button Edit (create mode -> edit mode)
  updateActivity(activity: ActivityUpdate) {
    this.editingActivity = activity; //edit mode

    this.newActivity = {
      title: activity.title,
      duration: activity.duration,
      date: activity.date,
      categoryId: activity.categoryId
    };
  }

  //Object for create/update form
  newActivity: ActivityCreate = {
    title: '',
    duration: null as any,
    date: '',
    categoryId: null as any
  };

  //Button Save (create mode + edit mode)
  saveActivity(form: NgForm) {

    if (this.editingActivity) { //if it's in edit mode
      //UPDATE
      const updated: ActivityUpdate = {
        id: this.editingActivity.id,
        ...this.newActivity
      };
      this.loading = true;
      this.activityService.putActivity(updated).subscribe({
        next: () => {
          this.showMessage('Activity updated successfully! ✅');
          this.loading = false;
          this.resetForm(form);
        },
        error: (err) => {
          this.showMessage('Error updating activity! ❌', 'error');
          this.loading = false;
        }
      });

    } else { //if it's in create mode
      //CREATE
      this.loading = true;
      this.activityService.postActivity(this.newActivity).subscribe({
        next: () => {
          this.showMessage('Activity created successfully! ✅');
          this.loading = false;
          this.resetForm(form);
        },
        error: (err) => {
          this.showMessage('Error creating activity! ❌', 'error');
          this.loading = false;
        }
      });
    }
  }

  //Reset form after create/update
  resetForm(form: NgForm) {
    form.resetForm();

    this.editingActivity = null;

    this.loadActivities();
  }


  // === DELETE ===
  removeActivity(id: number) {
    const confirmed = confirm("Are you sure want to delete this activity?");

    if (!confirmed) return;

    this.activityService.deleteActivity(id).subscribe({
      next: () => {
        this.showMessage('Activity deleted successfully! 🗑️');
        this.loadActivities();
      }
    });
  }


  // CATEGORIES

  // === VIEW ===
  categories$!: Observable<Category[]>;
  loadCategories() {
    this.categories$ = this.categoryService.getCategories();
  }
}