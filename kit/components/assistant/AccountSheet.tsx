import { useEffect, useState } from 'react';
import Select from '../ui/Select';
import { ArrowLeft as ArrowLeftIcon, DocumentDownload as DocumentDownloadIcon, Trash as TrashIcon, VolumeHigh as VolumeHighIcon } from 'iconsax-reactjs';
import { Ico } from '../Ico';
import type { Account } from '../../assistant/client';
import { T, tf, VOICES, type Settings, type VoiceId } from '../../assistant/config';
import { listMicrophones, MIC_KEY } from './audio';

// "Your chat": settings (voice, patience, memory, microphone) and earlier conversations.

export const sampleKey = (voice: VoiceId) => -1 - VOICES.findIndex((v) => v.id === voice);

function Switch({ on, label, onChange }: { on: boolean; label: string; onChange: (v: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className="amc-switch" onClick={() => onChange(!on)} />;
}

export function AccountSheet({ account, speakingKey, onClose, onSettings, onSample, onOpen, onDownload, canDownload, onErase }: {
  account: Account;
  speakingKey?: number;
  onClose: () => void;
  onSettings: (s: Partial<Settings>) => void;
  onSample: (voice: VoiceId) => void;
  onOpen: (id: string) => void;
  onDownload: () => void;
  canDownload: boolean;
  onErase: () => void;
}) {
  const [tab, setTab] = useState<'settings' | 'chats'>('settings');
  const [confirm, setConfirm] = useState(false);
  const [mics, setMics] = useState<{ id: string; label: string }[]>([]);
  const [mic, setMic] = useState('');
  const s = account.settings;

  useEffect(() => {
    if (!account.voice) return;
    listMicrophones().then(setMics);
    try {
      setMic(localStorage.getItem(MIC_KEY) ?? '');
    } catch {
      // storage blocked
    }
  }, [account.voice]);

  if (!s) return null;
  const convs = account.conversations ?? [];

  return (
    <div className="amc-sheet" role="region" aria-label={T.settings}>
      <div className="amc-tabs" role="tablist">
        <button type="button" className="amc-icon-btn" aria-label={T.account.back} onClick={onClose} style={{ marginRight: 4 }}><Ico icon={ArrowLeftIcon} size={18} /></button>
        <button type="button" role="tab" aria-selected={tab === 'settings'} onClick={() => setTab('settings')}>{T.account.tabSettings}</button>
        <button type="button" role="tab" aria-selected={tab === 'chats'} onClick={() => setTab('chats')}>{T.account.tabChats}</button>
      </div>
      <div className="amc-sheet-body" role="tabpanel">
        {tab === 'settings' ? (
          <>
            <div className="amc-set">
              <p style={{ margin: 0 }}>{T.account.thisDevice}</p>
            </div>
            {account.voice && (
              <>
                <div className="amc-set">
                  <h4 id="amc-voice-h">{T.account.voice}</h4>
                  <p>{T.account.voiceHelp}</p>
                  <div className="amc-voices" role="radiogroup" aria-labelledby="amc-voice-h">
                    {VOICES.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={s.voice === v.id}
                        onClick={() => {
                          if (s.voice !== v.id) onSettings({ voice: v.id });
                          onSample(v.id);
                        }}
                      >
                        <Ico icon={VolumeHighIcon} size={16} variant={speakingKey === sampleKey(v.id) ? 'Bold' : 'Linear'} /> {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="amc-set">
                  <div className="amc-switch-row">
                    <div><h4>{T.account.patient}</h4><p style={{ margin: 0 }}>{T.account.patientHelp}</p></div>
                    <Switch on={s.patient} label={T.account.patient} onChange={(v) => onSettings({ patient: v })} />
                  </div>
                </div>
                {mics.length > 1 && (
                  <div className="amc-set">
                    <h4><label htmlFor="amc-mic">{T.account.microphone}</label></h4>
                    <Select id="amc-mic" value={mic} options={[{ value: '', label: T.account.microphoneDefault }, ...mics.map((m) => ({ value: m.id, label: m.label }))]} onChange={(v) => {
                        setMic(v);
                        try {
                          if (v) localStorage.setItem(MIC_KEY, v);
                          else localStorage.removeItem(MIC_KEY);
                        } catch {
                          // storage blocked
                        }
                      }} />
                  </div>
                )}
              </>
            )}
            <div className="amc-set">
              <div className="amc-switch-row">
                <div><h4>{T.account.memory}</h4><p style={{ margin: 0 }}>{s.memory ? T.account.memoryOn : T.account.memoryOff}</p></div>
                <Switch on={s.memory} label={T.account.memory} onChange={(v) => onSettings({ memory: v })} />
              </div>
            </div>
            <div className="amc-set" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
              <button type="button" className="amc-link" onClick={onDownload} disabled={!canDownload}><Ico icon={DocumentDownloadIcon} size={16} /> {T.account.download}</button>
              {confirm ? (
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 13.5 }}>{T.account.eraseConfirm}</p>
                  <div className="amc-row" style={{ justifyContent: 'flex-start', gap: 16 }}>
                    <button type="button" className="amc-link amc-danger" onClick={onErase}>{T.account.eraseYes}</button>
                    <button type="button" className="amc-link" onClick={() => setConfirm(false)}>{T.account.cancel}</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="amc-link amc-danger" onClick={() => setConfirm(true)}><Ico icon={TrashIcon} size={16} /> {T.account.erase}</button>
              )}
            </div>
          </>
        ) : convs.length ? (
          <>
            <h4 style={{ margin: '0 0 10px', fontSize: 14.5 }}>{T.account.past}</h4>
            <ul className="amc-convs">
              {convs.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => onOpen(c.id)}>
                    <b>{c.title}</b>
                    <small>
                      {new Date(c.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {c.count === 1 ? T.account.oneQuestion : tf(T.account.questions, { count: c.count })}
                    </small>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p style={{ margin: 0, color: 'var(--amc-muted)' }}>{T.account.noPast}</p>
        )}
      </div>
    </div>
  );
}
