'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

const FORM_STORAGE_KEY = 'student-desktop-launch-form';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROOM_CODE_REGEX = /^[A-Z0-9]{8}$/;

interface LaunchFormState {
  roomCode: string;
  studentName: string;
  studentEmail: string;
}

function normalizeRoomCode(roomCode: string) {
  return roomCode.replace(/\s/g, '').toUpperCase();
}

export default function StudentDesktopLaunchPage() {
  const launchTimerRef = useRef<number | null>(null);
  const [form, setForm] = useState<LaunchFormState>({
    roomCode: '',
    studentName: '',
    studentEmail: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [showFallbackHelp, setShowFallbackHelp] = useState(false);
  const [copiedField, setCopiedField] = useState<'roomCode' | 'desktopLink' | null>(null);

  const normalizedRoomCode = useMemo(() => normalizeRoomCode(form.roomCode), [form.roomCode]);
  const normalizedStudentName = useMemo(() => form.studentName.trim(), [form.studentName]);
  const normalizedStudentEmail = useMemo(
    () => form.studentEmail.trim().toLowerCase(),
    [form.studentEmail]
  );

  const desktopLink = useMemo(() => {
    if (!normalizedRoomCode) {
      return '';
    }

    const params = new URLSearchParams({ autoJoin: '1' });

    if (normalizedStudentName) {
      params.set('name', normalizedStudentName);
    }

    if (normalizedStudentEmail) {
      params.set('email', normalizedStudentEmail);
    }

    return `proctor://room/${normalizedRoomCode}?${params.toString()}`;
  }, [normalizedRoomCode, normalizedStudentEmail, normalizedStudentName]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedForm = window.sessionStorage.getItem(FORM_STORAGE_KEY);
      const queryCode = new URLSearchParams(window.location.search).get('code');

      if (!storedForm && !queryCode) {
        return;
      }

      const parsedForm = storedForm ? (JSON.parse(storedForm) as Partial<LaunchFormState>) : {};

      setForm({
        roomCode: normalizeRoomCode(queryCode || parsedForm.roomCode || ''),
        studentName: parsedForm.studentName || '',
        studentEmail: parsedForm.studentEmail || '',
      });
    } catch (storageError) {
      console.error('Failed to restore desktop launch form:', storageError);
      window.sessionStorage.removeItem(FORM_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(
      FORM_STORAGE_KEY,
      JSON.stringify({
        roomCode: normalizedRoomCode,
        studentName: normalizedStudentName,
        studentEmail: normalizedStudentEmail,
      } satisfies LaunchFormState)
    );
  }, [normalizedRoomCode, normalizedStudentEmail, normalizedStudentName]);

  useEffect(() => {
    return () => {
      if (launchTimerRef.current !== null) {
        window.clearTimeout(launchTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async (value: string, field: 'roomCode' | 'desktopLink') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch (copyError) {
      console.error('Failed to copy student desktop launch value:', copyError);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedStudentName || normalizedStudentName.length < 2) {
      setError('Enter your full name before continuing.');
      return;
    }

    if (!EMAIL_REGEX.test(normalizedStudentEmail)) {
      setError('Enter a valid email address before continuing.');
      return;
    }

    if (!ROOM_CODE_REGEX.test(normalizedRoomCode)) {
      setError('Enter the 8-character room code shared by your teacher.');
      return;
    }

    setError(null);
    setShowFallbackHelp(false);
    setStatus('Opening the desktop app and passing your room details...');

    if (launchTimerRef.current !== null) {
      window.clearTimeout(launchTimerRef.current);
    }

    window.location.href = desktopLink;

    launchTimerRef.current = window.setTimeout(() => {
      setShowFallbackHelp(true);
      setStatus('If the desktop app did not open, use the fallback options below.');
    }, 1600);
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="surface-panel overflow-hidden rounded-[36px]">
          <div className="grid gap-0 lg:grid-cols-[1.02fr,0.98fr]">
            <div className="bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
                Desktop exam launch
              </span>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Continue in the proctoring app
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                The exam does not run in this browser tab. Enter your room details here, then the
                desktop client will open and take over the monitored exam flow.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Step 1
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    Enter the room code, your full name, and your institutional email.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Step 2
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    Click <span className="font-semibold">Proceed in desktop app</span> so the handoff link can open the client.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Step 3
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    If the app does not open, use the fallback controls on the right to try again or copy the room code.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="max-w-xl">
                <span className="eyebrow-pill">Student handoff</span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                  Prepare the desktop launch
                </h2>
                <p className="section-copy mt-3">
                  We package your room and identity details into a desktop link so the app can open
                  directly into the correct room.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-950">Room code</span>
                    <input
                      value={form.roomCode}
                      onChange={event =>
                        setForm(current => ({
                          ...current,
                          roomCode: normalizeRoomCode(event.target.value),
                        }))
                      }
                      className="input-field uppercase tracking-[0.18em]"
                      maxLength={8}
                      placeholder="AB12CD34"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-950">Full name</span>
                    <input
                      value={form.studentName}
                      onChange={event =>
                        setForm(current => ({
                          ...current,
                          studentName: event.target.value,
                        }))
                      }
                      className="input-field"
                      placeholder="Aarav Sharma"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-950">Email address</span>
                    <input
                      value={form.studentEmail}
                      onChange={event =>
                        setForm(current => ({
                          ...current,
                          studentEmail: event.target.value,
                        }))
                      }
                      className="input-field"
                      placeholder="student@example.com"
                      type="email"
                    />
                  </label>

                  <button type="submit" className="btn-primary w-full">
                    Proceed in desktop app
                  </button>
                </form>

                {error ? (
                  <div className="mt-4 rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                {status ? (
                  <div className="mt-4 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {status}
                  </div>
                ) : null}

                <div className="mt-6 grid gap-4">
                  <div className="surface-card rounded-[24px] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Room code
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        readOnly
                        value={normalizedRoomCode}
                        className="input-field flex-1 font-semibold uppercase tracking-[0.18em]"
                      />
                      <button
                        type="button"
                        disabled={!normalizedRoomCode}
                        onClick={() => handleCopy(normalizedRoomCode, 'roomCode')}
                        className="btn-secondary"
                      >
                        {copiedField === 'roomCode' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="surface-card rounded-[24px] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Desktop link
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        readOnly
                        value={desktopLink}
                        className="input-field flex-1 text-xs"
                      />
                      <button
                        type="button"
                        disabled={!desktopLink}
                        onClick={() => handleCopy(desktopLink, 'desktopLink')}
                        className="btn-secondary"
                      >
                        {copiedField === 'desktopLink' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                {showFallbackHelp ? (
                  <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                    <p className="font-semibold">If the desktop app did not open</p>
                    <p className="mt-2 leading-6">
                      Open the Electron proctoring app manually. If it is already open, enter the
                      room code above in the desktop join screen, then try the launch again.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (desktopLink) {
                            window.location.href = desktopLink;
                          }
                        }}
                        className="btn-primary"
                      >
                        Try desktop launch again
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(normalizedRoomCode, 'roomCode')}
                        disabled={!normalizedRoomCode}
                        className="btn-secondary"
                      >
                        Copy room code
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
