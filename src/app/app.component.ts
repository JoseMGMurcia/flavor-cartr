import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from 'app/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FooterComponent } from 'app/components/footer/footer.component';
import { MenuComponent } from 'app/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    FooterComponent,
    MenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public loading = true;
  private _destroyRef = inject(DestroyRef);

  constructor(
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.fetch();
  }

  private setLoagingStatus(): void {
    this.loadingService.loading$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((loading: boolean) => {
      this.loading = loading;
      this.changeDetectorRef.detectChanges();
    });
  }

  private async fetch() {
    this.setLoagingStatus();
  }
}
