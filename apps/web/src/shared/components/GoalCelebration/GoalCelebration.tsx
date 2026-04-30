import { useEffect, useRef } from 'react';
import { useApplications } from '@/shared/hooks/useApplications';
import { GOAL } from '@/shared/constants/application';
import { useEmojiExplosion } from '@/shared/components/EmojiExplosion';

/**
 * Watches the application count and fires the emoji waterfall once
 * when the user crosses the goal line (4 → 5+). Guarded by a ref so
 * StrictMode's double-effect doesn't double-explode, and by the
 * "previous value" check so reloading a tab that's already at 5
 * doesn't replay the celebration.
 */
export const GoalCelebration = () => {
  const { applications } = useApplications();
  const explode = useEmojiExplosion();
  const previous = useRef(applications.length);

  useEffect(() => {
    const before = previous.current;
    const after = applications.length;
    if (before < GOAL && after >= GOAL) {
      explode();
    }
    previous.current = after;
  }, [applications.length, explode]);

  return null;
};
