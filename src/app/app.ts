import { Component } from '@angular/core';
import { ActivityService } from './services/activity.service';
import { CommonModule, DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { Activity, CreateActivity, UpdateActivity } from './models/activity.model';
import { FormsModule } from '@angular/forms';

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
  activities$ = this.activityService.getActivities();

  //CREATE
  newActivity: CreateActivity = {
    title: '',
    duration: 0,
    date: '',
    categoryId: 0,
    createdAt: new DatePipe('en-US').transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')!
  };
  createActivity() {
    this.activityService.postActivity(this.newActivity).subscribe({
      next: (res) => {
        console.log('Activity created:', res);
        this.activities$ = this.activityService.getActivities(); //aggiorna lista delle attività dopo la creazione
      },
      error: (err) => {
        console.error('FULL ERROR:', err);
        console.log('Backend says:', err.error);
      }
    });
  }

  //UPDATE
  updateActivity(activity: Activity) {
    this.activityService.putActivity(activity).subscribe({
      next: (res) => {
        console.log('Activity updated:', res);
        this.activities$ = this.activityService.getActivities();
      },
      error: (err) => {
        console.error('FULL ERROR:', err);
        console.log('Backend says:', err.error);
      }
    });
  }

  //DELETE
  removeActivity(id: number) {
    this.activityService.deleteActivity(id).subscribe({
      next: () => {
        console.log('Activity deleted');
        this.activities$ = this.activityService.getActivities();
      },
      error: (err) => {
        console.error('FULL ERROR:', err);
        console.log('Backend says:', err.error);
      }
    });
  }
}