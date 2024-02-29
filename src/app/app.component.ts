import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'carrito';
  public loading = false;
  private _destroyRef = inject(DestroyRef);

  constructor(
    private translate: TranslateService,
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.fetch();
  }

  private setLoagingStatus(): void {
    this.loadingService.character$
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe((loading: boolean) => {
      this.loading = loading;
      this.changeDetectorRef.detectChanges();
    });
  }

  private setTranslationsLanguage(language: string): void {
    // this.translate.setDefaultLang(language);
    // this.translate.use(language);
  }

  private async fetch() {
    this.setTranslationsLanguage('es');
    this.setLoagingStatus();
  }
}
