export function formatBOB(amount: number): string {
  return new Intl.NumberFormat('es-BO').format(amount);
}
