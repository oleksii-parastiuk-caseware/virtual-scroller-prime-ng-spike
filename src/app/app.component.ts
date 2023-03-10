import { BehaviorSubject } from 'rxjs';
import { Component, HostListener, ViewChild } from '@angular/core';
import { Account, AccountService } from './account.service';
import { VirtualScroller } from 'primeng/virtualscroller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('vs') vs: VirtualScroller = null as any;

  filteredAccounts$ = new BehaviorSubject<Account[]>([]);
  draggedAccounts$ = new BehaviorSubject<Account[]>([]);

  availableAccounts: Account[] = [];
  checkedAccounts: Account[] = [];
  selectedAccounts: Account[] = [];

  query$ = new BehaviorSubject<string>('');

  constructor(private accountService: AccountService) {
    this.accountService.generateAccounts$().subscribe((accounts) => {
      this.availableAccounts = accounts;
      this.filteredAccounts$.next(accounts);
    });
  }

  /* @HostListener('dragstart', ['$event'])
  async onDragStart(event: DragEvent) {
    const img = new Image();
    img.src = '../assets/penguin.png';
    event.dataTransfer?.setDragImage(img, 250, 250);
  } */

  dragStart(event: Account): void {
    const draggedAccounts = this.checkedAccounts.length
      ? this.checkedAccounts
      : [event];

    this.draggedAccounts$.next(draggedAccounts);
  }

  dragEnd(): void {
    this.draggedAccounts$.next([]);
    this.checkedAccounts = [];
  }

  check(checked: boolean, { id }: Account): void {
    const account = this.availableAccounts.find((account) => account.id === id);

    if (!account) return;

    if (checked) {
      this.checkedAccounts.push(account);
    }

    if (!checked) {
      const updatedSelection = this.checkedAccounts.filter(
        (checkedAccount) => checkedAccount.id !== account.id
      );

      this.checkedAccounts = updatedSelection;
    }
  }

  drop(): void {
    const draggedAccounts = this.draggedAccounts$.value;

    if (!draggedAccounts.length) {
      return;
    }

    const draggedAccountsIds = this.draggedAccounts$.value.map(({ id }) => id);

    this.selectedAccounts = [
      ...this.selectedAccounts,
      ...this.draggedAccounts$.value,
    ];

    const updated = this.filteredAccounts$.value.reduce((acc, account) => {
      const match = draggedAccountsIds.some((id) => id === account.id);

      if (!match) acc.push(account);

      return acc;
    }, [] as Account[]);

    this.filteredAccounts$.next(updated);
    this.checkedAccounts = [];
    this.draggedAccounts$.next([]);
  }

  scrollToTop(): void {}

  searchAccount(query: string) {
    if (query.length < 3) {
      if (this.allAccountsAreDisplayed) return;

      this.filteredAccounts$.next(this.availableAccounts);
    }

    this.vs.scrollToIndex(0);

    const result = this.availableAccounts.filter((account) =>
      account.name.includes(query)
    );

    this.filteredAccounts$.next(result);
  }

  private get allAccountsAreDisplayed(): boolean {
    return (
      this.filteredAccounts$.value.length === this.availableAccounts.length
    );
  }
}
