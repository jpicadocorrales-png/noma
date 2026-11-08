import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { DemoReply } from './demo/replies';
import { getDestination } from '../../data/destinations';
import { StreamedText } from './StreamedText';
import { ProposalCard } from './ProposalCard';
import { Photo } from '../ui/Photo';
import { Icon } from '../ui/Icon';
import styles from './NomaReply.module.css';

interface NomaReplyProps {
  reply: DemoReply;
  animate: boolean;
  /** Only the latest reply offers follow-up suggestions. */
  isLatest: boolean;
  declined: boolean;
  onProgress: () => void;
  onFollowUp: (q: string) => void;
  onApply: (changeId: string) => void;
  onDecline: () => void;
  onNavigate: () => void;
}

export function NomaReply({
  reply,
  animate,
  isLatest,
  declined,
  onProgress,
  onFollowUp,
  onApply,
  onDecline,
  onNavigate,
}: NomaReplyProps) {
  const [textDone, setTextDone] = useState(!animate);

  // Cards and links render after the text; keep the newest content in view once they exist.
  useEffect(() => {
    if (textDone) onProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDone]);

  const destinations = (reply.destinations ?? []).map(getDestination).filter((d) => d !== undefined);

  return (
    <div className={styles.reply}>
      <StreamedText
        text={reply.text}
        animate={animate}
        className={styles.text}
        onProgress={onProgress}
        onDone={() => setTextDone(true)}
      />

      {textDone && (
        <div className={styles.extras}>
          {reply.bullets && reply.bullets.length > 0 && (
            <ul className={styles.bullets}>
              {reply.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}

          {destinations.length > 0 && (
            <ul className={styles.places}>
              {destinations.map((d) => (
                <li key={d.id}>
                  <Link to={`/destinations/${d.id}`} className={styles.place} onClick={onNavigate}>
                    <span className={styles.thumb}>
                      <Photo id={d.photo.id} alt="" focus={d.photo.focus} sizes="48px" maxWidth={400} />
                    </span>
                    <span className={styles.placeText}>
                      <span className={styles.placeName}>{d.name}</span>
                      <span className={`t-meta ${styles.placeMeta}`}>
                        {d.location} · {d.bestSeason}
                      </span>
                    </span>
                    <Icon name="chevron-right" size={16} className={styles.chevron} />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {reply.proposal && (
            <ProposalCard
              changeId={reply.proposal}
              declined={declined}
              onApply={() => onApply(reply.proposal!)}
              onDecline={onDecline}
              onNavigate={onNavigate}
            />
          )}

          {reply.links && reply.links.length > 0 && (
            <div className={styles.links}>
              {reply.links.map((l) => (
                <Link key={l.to} to={l.to} className={styles.link} onClick={onNavigate}>
                  {l.label}
                  <Icon name="arrow-right" size={14} />
                </Link>
              ))}
            </div>
          )}

          {isLatest && reply.followUps && reply.followUps.length > 0 && (
            <ul className={styles.followUps} aria-label="Suggested follow-ups">
              {reply.followUps.map((f) => (
                <li key={f}>
                  <button type="button" className={styles.followUp} onClick={() => onFollowUp(f)}>
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
