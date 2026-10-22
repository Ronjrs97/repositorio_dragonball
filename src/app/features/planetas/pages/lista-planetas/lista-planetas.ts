import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { Paginador } from '@shared/ui/paginador/paginador';
import { PlanetasService } from '../../services/planetas.service';
import { PlanetaCard } from '../../components/planeta-card/planeta-card';

@Component({
  selector: 'app-lista-planetas',
  imports: [PlanetaCard, Paginador],
  templateUrl: './lista-planetas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPlanetas {
  private readonly servicio = inject(PlanetasService);
  protected readonly pagina = signal(1);

  private readonly respuesta = toSignal(
    toObservable(this.pagina).pipe(
      switchMap((pagina) =>
        this.servicio.listar(pagina).pipe(
          map((data) => ({ status: 'loaded' as const, data })),
          catchError(() => of({ status: 'error' as const })),
        ),
      ),
    ),
  );

  protected readonly cargando = computed(() => this.respuesta() === undefined);
  protected readonly fallo = computed(() => this.respuesta()?.status === 'error');
  protected readonly planetas = computed(() => {
    const respuesta = this.respuesta();
    return respuesta?.status === 'loaded' ? respuesta.data.items : [];
  });
  protected readonly total = computed(() => {
    const respuesta = this.respuesta();
    return respuesta?.status === 'loaded' ? respuesta.data.meta.totalItems : 0;
  });
  protected readonly totalPaginas = computed(() => {
    const respuesta = this.respuesta();
    return respuesta?.status === 'loaded' ? respuesta.data.meta.totalPages : 0;
  });
}
