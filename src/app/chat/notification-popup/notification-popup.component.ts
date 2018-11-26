import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LocalStorageService} from 'angular-2-local-storage';
import {ChatService} from '../chat.service';
import { NotificationsModel } from '../notifications.model';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html'
})
export class NotificationPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<NotificationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationsModel[],
    private localStorage: LocalStorageService,
    private chatService: ChatService) {}

  private addPrivateDialog(notification: NotificationsModel): Promise<any> {
    const dataFilled = {
      interlocutor: {
        name: notification.user.name,
        email: notification.user.email
      },
      sender: {
        name: this.getUser().name,
        email: this.getUser().email
      },
      created_at: new Date()
    };
    return new Promise(resolve => {
      this.chatService.addPrivateDialog(dataFilled)
        .subscribe(response => resolve(response));
    });
  }

  public async giveConsent(notification: NotificationsModel, index: number) {
    let next = false;
    await this.addPrivateDialog(notification)
      .then(() => next = true);
    if (!next) {
      return;
    }
    await this.deleteNotificationById(notification._id)
      .then(() => {
        this.data.splice(index, 1);
        if (!this.data.length) {
          this.dialogRef.close();
        }
      });
    const dataFilled = {
      type: 'face-to-face-approved',
      user: {
        name: this.getUser().name,
        email: this.getUser().email
      },
      interlocutor_email: notification.user.email,
      created_at: new Date()
    };
    this.chatService.addNotification(dataFilled, notification.user)
      .subscribe(() => console.log('face-to-face-approved'));
  }

  private deleteNotificationById(id: string): Promise<any> {
    return new Promise(resolve => {
      this.chatService.deleteNotification(id)
        .subscribe(response => resolve(response));
    });
  }

  public async deleteNotification(notification: NotificationsModel, index: number) {
    await this.deleteNotificationById(notification._id)
      .then(() => {
        this.data.splice(index, 1);
        if (!this.data.length) {
          this.dialogRef.close();
        }
      });
    if (notification.type === 'face-to-face-invite') {
      const dataFilled = {
        type: 'face-to-face-removed',
        user: {
          name: this.getUser().name,
          email: this.getUser().email
        },
        interlocutor_email: notification.user.email,
        created_at: new Date()
      };
      this.chatService.addNotification(dataFilled, notification.user)
        .subscribe(() => console.log('face-to-face-removed'));
    }
  }

  public getUser() {
    return this.localStorage.get<any>('user');
  }

}
