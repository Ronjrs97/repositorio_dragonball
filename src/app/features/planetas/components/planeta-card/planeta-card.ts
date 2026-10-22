import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Planeta } from '../../models/planeta.model';

@Component({
  selector: 'app-planeta-card',
  host: { class: 'block' },
  templateUrl: './planeta-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetaCard {
  readonly planeta = input.required<Planeta>();
}
