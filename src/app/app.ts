import { Component } from '@angular/core';
import { ActivityService } from './services/activity.service';
import { CommonModule, DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { Activity, ActivityCreate, ActivityUpdate } from './models/activity.model';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

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

  constructor() { }

  //READ
  activities$!: Observable<Activity[]>;
  loadActivities() {
    this.activities$ = this.activityService.getActivities();
  }
  ngOnInit() {
    this.loadActivities();
  }

  //CREATE
  newActivity: ActivityCreate = {
    title: '',
    duration: 0,
    date: '',
    categoryId: 0
  };
  createActivity(form: any) {
    this.activityService.postActivity(this.newActivity).subscribe({
      next: () => {
        alert('Activity created successfully! ✅');
        form.resetForm();
        this.loadActivities();
      },
      error: (err) => {
        console.error('Full error:', err);
        alert('Error creating activity! ❌');
      }
    });
  }

  //UPDATE
  updateActivity(activity: ActivityUpdate) {
    this.activityService.putActivity(activity).subscribe({
      next: () => {
        alert('Activity updated successfully! ✅');
        this.loadActivities();
      },
      error: (err) => {
        console.error('Full error:', err);
        alert('Error updating activity! ❌');
      }
    });
  }

  //DELETE
  removeActivity(id: number) {
    this.activityService.deleteActivity(id).subscribe({
      next: () => {
        alert('Activity deleted successfully! ✅');
        this.loadActivities();
      },
      error: (err) => {
        console.error('Full error:', err);
        alert('Error deleting activity! ❌');
      }
    });
  }
}