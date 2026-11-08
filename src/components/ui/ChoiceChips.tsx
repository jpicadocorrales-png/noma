import { Icon } from './Icon';
import { cx } from '../../lib/cx';
import styles from './ChoiceChips.module.css';

interface Choice {
  id: string;
  label: string;
}

interface BaseProps {
  label: string;
  options: Choice[];
  className?: string;
}

interface SingleProps extends BaseProps {
  mode: 'single';
  value: string;
  onChange: (id: string) => void;
}

interface MultiProps extends BaseProps {
  mode: 'multi';
  value: string[];
  onChange: (ids: string[]) => void;
}

/** Selectable chips: radio-like (single) or checkbox-like (multi). */
export function ChoiceChips(props: SingleProps | MultiProps) {
  const { label, options, className, mode } = props;

  const isSelected = (id: string) => (mode === 'single' ? props.value === id : props.value.includes(id));

  const select = (id: string) => {
    if (props.mode === 'single') props.onChange(id);
    else props.onChange(props.value.includes(id) ? props.value.filter((v) => v !== id) : [...props.value, id]);
  };

  return (
    <div role={mode === 'single' ? 'radiogroup' : 'group'} aria-label={label} className={cx(styles.chips, className)}>
      {options.map((o) => {
        const selected = isSelected(o.id);
        return (
          <button
            key={o.id}
            type="button"
            role={mode === 'single' ? 'radio' : 'checkbox'}
            aria-checked={selected}
            className={cx(styles.chip, selected && styles.selected)}
            onClick={() => select(o.id)}
          >
            {mode === 'multi' && (
              <span className={styles.tick} aria-hidden="true">
                <Icon name={selected ? 'check' : 'plus'} size={14} strokeWidth={2} />
              </span>
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
