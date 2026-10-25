import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './accordion.css';

export interface AccordionItem {
  /** Stable, unique id. Drives open state and DOM ids, so don't use the array index. */
  id: string;
  /** Text shown in the trigger button */
  title: string;
  /** Panel contents */
  content: ReactNode;
  /** Prevents the item from being toggled or focused with the keyboard */
  disabled?: boolean;
}

interface AccordionBaseProps {
  items: AccordionItem[];
  headingLevel: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  mode?: 'single' | 'multiple';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  animation?: boolean;
  width?: 'components' | 'inner' | 'wide' | 'full';
  baseClass?: string;
  onOpenChange?: (openIds: string[]) => void;
}

/**
 * Uncontrolled: the Accordion owns its open state.
 * `defaultOpenIds` only seeds the initial state.
 */
interface UncontrolledProps extends AccordionBaseProps {
  defaultOpenIds?: string[];
  openIds?: undefined;
}

/**
 * Controlled: the parent owns the open state and must update `openIds`
 * in response to `onOpenChange`.
 */
interface ControlledProps extends AccordionBaseProps {
  openIds: string[];
  onOpenChange: (openIds: string[]) => void;
  defaultOpenIds?: undefined;
}

// A discriminated union, so TypeScript rejects `defaultOpenIds` together with `openIds`,
// and rejects `openIds` without an `onOpenChange` to update it.
export type AccordionProps = UncontrolledProps | ControlledProps;

export default function Accordion(props: AccordionProps) {
  const {
    items,
    headingLevel,
    mode = 'single',
    theme,
    animation,
    width = 'components',
    baseClass,
    onOpenChange,
    openIds: controlledOpenIds,
    defaultOpenIds,
  } = props;

  const Heading = headingLevel;
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // State is only used when uncontrolled. The lazy initializer runs once, on first render.
  const [internalOpenIds, setInternalOpenIds] = useState<string[]>(() =>
    mode === 'single' ? (defaultOpenIds ?? []).slice(0, 1) : (defaultOpenIds ?? [])
  );

  const isControlled = controlledOpenIds !== undefined;
  const openIds = isControlled ? controlledOpenIds : internalOpenIds;

  const toggle = (id: string) => {
    const isOpen = openIds.includes(id);
    let nextOpenIds: string[];

    if (isOpen) {
      nextOpenIds = openIds.filter((openId) => openId !== id);
    } else if (mode === 'single') {
      nextOpenIds = [id];
    } else {
      nextOpenIds = [...openIds, id];
    }

    if (!isControlled) {
      setInternalOpenIds(nextOpenIds);
    }
    onOpenChange?.(nextOpenIds);
  };

  // WAI-ARIA accordion keyboard pattern: arrows move between triggers, Home/End jump to the ends.
  // Tab and Enter/Space already work because the triggers are real <button> elements.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const triggers = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]:not(:disabled)') ?? []
    );
    const current = triggers.indexOf(event.target as HTMLButtonElement);
    if (current === -1) return;

    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = (current + 1) % triggers.length;
        break;
      case 'ArrowUp':
        next = (current - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = triggers.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    triggers[next].focus();
  };

  // WAI-ARIA advises against role="region" on every panel when there are many,
  // because it floods the landmark list for screen reader users.
  const panelRole = items.length <= 6 ? 'region' : undefined;

  return (
    <div
      className={['accordion', baseClass].filter(Boolean).join(' ')}
      data-component-theme={theme || 'primary'}
      data-component-animation={animation ? 'true' : 'false'}
      data-component-width={width}
    >
      <div className="accordion__inner" ref={containerRef} onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const isOpen = openIds.includes(item.id);
          const triggerId = `${baseId}-trigger-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <div className="accordion__item" key={item.id} data-state={isOpen ? 'open' : 'closed'}>
              <Heading className="accordion__heading">
                <button
                  type="button"
                  id={triggerId}
                  className="accordion__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  data-accordion-trigger
                  onClick={() => toggle(item.id)}
                >
                  <span className="accordion__title">{item.title}</span>
                  <span className="accordion__icon" aria-hidden="true" />
                </button>
              </Heading>
              <div
                id={panelId}
                className="accordion__panel"
                role={panelRole}
                aria-labelledby={panelRole ? triggerId : undefined}
                data-state={isOpen ? 'open' : 'closed'}
                inert={!isOpen}
              >
                <div className="accordion__panel-clip">
                  <div className="accordion__content">{item.content}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
