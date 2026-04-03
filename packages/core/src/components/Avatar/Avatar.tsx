import { forwardRef, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { useButton } from 'react-aria';
import type { AriaButtonOptions } from 'react-aria';
import type { PolymorphicComponentProps } from '../../utils/polymorphic';
import { cn } from '../../utils/cn';
import styles from './Avatar.module.css';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

const STATUS_LABELS: Record<AvatarStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  busy: 'Busy',
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

const FallbackIcon = () => (
  <svg
    data-testid="avatar-fallback-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    width="60%"
    height="60%"
  >
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

type InteractiveAvatarProps = {
  as: ElementType;
  onPress?: AriaButtonOptions<'button'>['onPress'];
  isDisabled?: boolean;
};

type StaticAvatarProps = {
  as?: undefined;
  onPress?: never;
  isDisabled?: never;
};

type AvatarBaseProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  fallbackIcon?: ReactNode;
};

export type AvatarOwnProps = AvatarBaseProps & (InteractiveAvatarProps | StaticAvatarProps);

export type AvatarProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  AvatarOwnProps
>;

export const Avatar = forwardRef<HTMLElement, AvatarProps>(
  (
    {
      as,
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      fallbackIcon,
      isDisabled = false,
      onPress,
      className,
      ...rest
    },
    forwardedRef,
  ) => {
    const [imgError, setImgError] = useState(false);
    const internalRef = useRef<HTMLElement>(null);
    const ref = (forwardedRef || internalRef) as React.RefObject<HTMLElement>;

    const isInteractive = !!as && as !== 'div';

    const { buttonProps } = useButton(
      {
        onPress: isInteractive ? onPress : undefined,
        isDisabled,
        elementType: as || 'div',
      },
      ref as React.RefObject<HTMLButtonElement>,
    );

    const Component = as || 'div';
    const label = name || alt || 'Avatar';

    const showImage = !!src && !imgError;
    const showInitials = !showImage && !!name && name.trim().length > 0;

    const containerProps = isInteractive
      ? { ...buttonProps, 'aria-label': label }
      : showImage
        ? { role: 'presentation' as const }
        : { role: 'img' as const, 'aria-label': label };

    return (
      <Component
        {...rest}
        {...containerProps}
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(
          styles.root,
          styles[size],
          styles[shape],
          isDisabled && styles.disabled,
          className,
        )}
      >
        {showImage && (
          <img src={src} alt={label} className={styles.image} onError={() => setImgError(true)} />
        )}
        {!showImage && showInitials && (
          <span aria-hidden="true" className={styles.initials}>
            {getInitials(name!)}
          </span>
        )}
        {!showImage && !showInitials && (fallbackIcon ?? <FallbackIcon />)}
        {status && (
          <span
            role="status"
            aria-label={STATUS_LABELS[status]}
            className={cn(styles.badge, styles[`badge--${status}`])}
          />
        )}
      </Component>
    );
  },
);

Avatar.displayName = 'Avatar';
