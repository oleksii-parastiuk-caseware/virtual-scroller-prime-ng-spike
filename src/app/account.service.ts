import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

export type Account = {
  id: number;
  name: string;
  selected: boolean;
};

@Injectable({ providedIn: 'root' })
export class AccountService {
  generateAccounts(): Account[] {
    return Array.from({ length: 30000 }).map((_, index) => ({
      id: index,
      name: this.generateName(),
      selected: false,
    }));
  }

  generateAccountsMap(): Map<number, Account> {
    const accountsMap: Map<number, Account> = new Map();

    const arr = Array.from({ length: 30000 }).map((_, index) => ({
      id: index,
      name: this.generateName(),
      selected: false,
    }));

    for (const item of arr) {
      accountsMap.set(item.id, item);
    }

    return accountsMap;
  }

  generateAccounts$(): Observable<Account[]> {
    return of(
      Array.from({ length: 30000 }).map((_, index) => ({
        id: index,
        name: this.generateName(),
        selected: false,
      }))
    );
  }

  generateName(): string {
    return uniqueNamesGenerator({
      dictionaries: [colors, animals, adjectives],
    });
  }
}
