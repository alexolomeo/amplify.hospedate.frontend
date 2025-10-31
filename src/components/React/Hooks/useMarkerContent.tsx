import { useCallback } from 'react';
import HomeIcon from '/src/icons/home.svg?react';
import ReactDOMServer from 'react-dom/server';
interface MarkerContentOptions {
  markerLabel?: string;
}
export function useMarkerContent({ markerLabel }: MarkerContentOptions) {
  const createLabel = useCallback(() => {
    if (!markerLabel) return null;
    const container = document.createElement('div');
    Object.assign(container.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    });
    const labelDiv = document.createElement('div');
    labelDiv.textContent = markerLabel;
    Object.assign(labelDiv.style, {
      padding: '4px 8px',
      borderRadius: '15px',
      fontSize: '14px',
      fontWeight: 'normal',
      marginBottom: '0px',
      whiteSpace: 'normal',
      textAlign: 'center',
      wordWrap: 'break-word',
    });
    labelDiv.classList.add('bg-primary', 'text-primary-content');
    const triangle = document.createElement('div');
    Object.assign(triangle.style, {
      width: '0',
      height: '0',
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: '10px solid #3674CE',
      marginTop: '0px',
    });
    container.appendChild(labelDiv);
    container.appendChild(triangle);
    return container;
  }, [markerLabel]);

  const createCircle = useCallback((translateY: string) => {
    const circle = document.createElement('div');
    Object.assign(circle.style, {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `translate(0%, ${translateY})`,
    });
    circle.classList.add('bg-primary');
    const svgHTML = ReactDOMServer.renderToStaticMarkup(
      <HomeIcon className="text-primary-content" />
    );
    circle.innerHTML = svgHTML;
    return circle;
  }, []);

  const createContainer = useCallback(
    (includeTriangle = false, circleTranslate = '15%') => {
      const container = document.createElement('div');
      Object.assign(container.style, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      });
      const label = createLabel();
      if (label) container.appendChild(label);
      const circle = createCircle(circleTranslate);
      container.appendChild(circle);
      if (includeTriangle) {
        const triangle = document.createElement('div');
        Object.assign(triangle.style, {
          width: '0',
          height: '0',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: '15px solid #3674CE',
          marginTop: '0px',
        });
        container.appendChild(triangle);
      }
      return container;
    },
    [createLabel, createCircle]
  );

  const createPinMarkerContent = useCallback(() => {
    return createContainer(true, '15%');
  }, [createContainer]);

  const createRoundedMarkerContent = useCallback(() => {
    return createContainer(false, '50%');
  }, [createContainer]);

  return {
    createPinMarkerContent,
    createRoundedMarkerContent,
  };
}
