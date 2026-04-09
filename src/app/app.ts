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
      this.activityService.putActivity(updated).subscribe({
        next: () => {
          alert('Activity updated successfully! ✏️');
          this.resetForm(form);
        },
        error: (err) => {
          console.error('Full error:', err);
          alert('Error updating activity! ❌');
        }
      });

    } else { //if it's in create mode
      //CREATE
      this.activityService.postActivity(this.newActivity).subscribe({
        next: () => {
          alert('Activity created successfully! ✅');
          this.resetForm(form);
        },
        error: (err) => {
          console.error('Full error:', err);
          alert('Error creating activity! ❌');
        }
      });
    }
  }

  //Reset form after create/update
  resetForm(form: NgForm) {
    form.resetForm();

    this.editingActivity = null;

    // this.newActivity = {
    //   title: '',
    //   duration: null as any,
    //   date: '',
    //   categoryId: null as any
    // };

    this.loadActivities();
  }


  // === DELETE ===
  removeActivity(id: number) {
    this.activityService.deleteActivity(id).subscribe({
      next: () => {
        alert('Activity deleted successfully! 🗑️');
        this.loadActivities();
      },
      error: (err) => {
        console.error('Full error:', err);
        alert('Error deleting activity! ❌');
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