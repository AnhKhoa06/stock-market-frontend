export class Stock {
  favorite: boolean = false;
  id?: number;

  constructor(
    public name: string,
    public code: string,
    public price: number,
    public previousPrice: number,
    public exchange: string,
    id?: number,
  ) {
    if (id !== undefined) this.id = id;
  }

  isPositiveChange(): boolean {
    return this.price >= this.previousPrice;
  }
}
