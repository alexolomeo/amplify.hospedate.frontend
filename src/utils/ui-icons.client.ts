import * as React from 'react';

type SvgComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Map de todos los íconos disponibles
const allIcons = import.meta.glob('/src/icons/**/*.svg', {
  query: 'react',
  eager: false,
});

export function useUiIcon(name?: string | null): SvgComp | null | undefined {
  const [Comp, setComp] = React.useState<SvgComp | null>(null);

  React.useEffect(() => {
    let alive = true;

    async function load() {
      if (!name) {
        setComp(null);
        return;
      }

      // Buscar un match dentro del glob
      const match = Object.entries(allIcons).find(([path]) =>
        path.endsWith(`/${name}.svg`)
      );

      if (!match) {
        if (alive) setComp(null);
        return;
      }

      const [, importer] = match;

      try {
        const mod = await importer();
        const Icon = (mod as { default: SvgComp }).default;
        if (alive) setComp(() => Icon);
      } catch (err) {
        console.error(`Error loading icon "${name}"`, err);
        if (alive) setComp(null);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [name]);

  return Comp;
}
