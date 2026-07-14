import { ChevronRightIcon } from '../../../../../assets/icons';

interface ChevronButtonProps {
  expanded: boolean;
  ariaLabel: string;
  onClick: () => void;
  testId?: string;
}

export const ChevronButton: React.FC<ChevronButtonProps> = ({ expanded, ariaLabel, onClick, testId }) => {
  return (
    <button
      type="button"
      className={`navlink-chevron${expanded ? ' expanded' : ''}`}
      aria-label={ariaLabel}
      aria-expanded={expanded}
      data-testid={testId}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <ChevronRightIcon />
    </button>
  );
};
