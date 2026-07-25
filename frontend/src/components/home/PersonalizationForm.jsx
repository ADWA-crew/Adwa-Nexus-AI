import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassSelect from '../common/GlassSelect';
import { useVisitor } from '../../hooks/useVisitor';
import { visitorService } from '../../services/visitor.service';
import {
  VISITOR_TYPES,
  AGE_GROUPS,
  getEducationOptions,
} from '../../utils/constants';
import './PersonalizationForm.css';

const ArrowRight = () => (
  <svg viewBox="0 0 20 20" width="17" height="17" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="10" x2="16" y2="10" />
    <polyline points="11,5 16,10 11,15" />
  </svg>
);

const Spinner = () => (
  <span className="pf-spinner" aria-hidden="true" />
);

const CheckCircle = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" />
    <polyline points="7.5,12.5 10.5,15.5 16.5,8.5" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" />
    <line x1="8" y1="5" x2="8" y2="8.5" />
    <circle cx="8" cy="11" r="0.6" fill="currentColor" />
  </svg>
);

const INITIAL = {
  fullName: '',
  visitorType: '',
  ageGroup: '',
  education: '',
};

export default function PersonalizationForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  const { startSession } = useVisitor();
  const navigate = useNavigate();

  const needsAge = form.visitorType === 'tourist';
  /* Tourists must pick an age before the education options can be resolved */
  const showEducation =
    form.visitorType !== '' && (!needsAge || form.ageGroup !== '');
  const educationOptions = getEducationOptions(form.visitorType, form.ageGroup);

  const clearError = (field) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleName = (e) => {
    setForm((f) => ({ ...f, fullName: e.target.value }));
    clearError('fullName');
  };

  /* Changing the type invalidates both dependent fields */
  const handleVisitorType = (value) => {
    setForm((f) => ({ ...f, visitorType: value, ageGroup: '', education: '' }));
    setErrors({});
  };

  /* Changing the age swaps the education option set, so clear the old choice */
  const handleAgeGroup = (value) => {
    setForm((f) => ({ ...f, ageGroup: value, education: '' }));
    clearError('ageGroup');
    clearError('education');
  };

  const handleEducation = (value) => {
    setForm((f) => ({ ...f, education: value }));
    clearError('education');
  };

  const validate = () => {
    const next = {};
    const name = form.fullName.trim();

    if (!name) next.fullName = 'Please enter your full name.';
    else if (name.length < 2) next.fullName = 'Name must be at least 2 characters.';

    if (!form.visitorType) next.visitorType = 'Please choose a visitor type.';
    if (needsAge && !form.ageGroup) next.ageGroup = 'Please select your age group.';
    if (showEducation && !form.education) {
      next.education = 'Please select your education background.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const session = await visitorService.createSession({
        fullName: form.fullName.trim(),
        visitorType: form.visitorType,
        ageGroup: needsAge ? form.ageGroup : null,
        education: form.education,
      });
      startSession(session);
      setResult(session);
      // Demo: under18 → /routes (child), above18 → /artifacts (researcher)
      navigate(session.redirectTo || '/profile', { replace: false });
    } catch (err) {
      console.error('Start journey failed:', err?.response?.data || err);
      setSubmitError('We could not start your journey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setForm(INITIAL);
    setErrors({});
  };

  /* Confirmation replaces the fields in place — no navigation */
  if (result) {
    return (
      <div className="pf-panel pf-panel--done">
        <div className="pf-done">
          <span className="pf-done__icon" aria-hidden="true">
            <CheckCircle />
          </span>

          <h2 className="pf-done__title">
            Your journey is ready, {result.visitor.fullName.split(' ')[0]}
          </h2>
          <p className="pf-done__text">{result.experience.summary}</p>

          <dl className="pf-done__meta">
            <div>
              <dt>Tone</dt>
              <dd>{result.experience.tone}</dd>
            </div>
            <div>
              <dt>Reading level</dt>
              <dd>{result.experience.readingLevel}</dd>
            </div>
            <div>
              <dt>Depth</dt>
              <dd>{result.experience.contentDepth}</dd>
            </div>
          </dl>

          <button type="button" className="pf-btn pf-btn--ghost" onClick={reset}>
            Adjust preferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="pf-panel" onSubmit={handleSubmit} noValidate>

      {/* Header */}
      <header className="pf-header">
        <span className="pf-eyebrow">Step 1 of 1</span>
        <h1 className="pf-title">Personalize Your Journey</h1>
        <p className="pf-subtitle">
          Tell us who you are and we will shape the museum experience around you.
        </p>
      </header>

      <div className="pf-fields">

        {/* Full name */}
        <div className="pf-field">
          <label className="pf-label" htmlFor="pf-fullname">
            Full Name <span className="pf-required" aria-hidden="true">*</span>
          </label>
          <input
            id="pf-fullname"
            type="text"
            className={`pf-input${errors.fullName ? ' pf-input--invalid' : ''}`}
            placeholder="e.g. Selam Tesfaye"
            value={form.fullName}
            onChange={handleName}
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'pf-fullname-err' : undefined}
          />
          {errors.fullName && (
            <p className="pf-error" id="pf-fullname-err" role="alert">
              <AlertIcon /> {errors.fullName}
            </p>
          )}
        </div>

        {/* Visitor type */}
        <div className="pf-field">
          <span className="pf-label" id="pf-type-label">
            I am visiting as <span className="pf-required" aria-hidden="true">*</span>
          </span>
          <GlassSelect
            id="pf-type"
            labelledBy="pf-type-label"
            options={VISITOR_TYPES}
            value={form.visitorType}
            onChange={handleVisitorType}
            placeholder="Select visitor type"
            invalid={!!errors.visitorType}
          />
          {errors.visitorType && (
            <p className="pf-error" role="alert">
              <AlertIcon /> {errors.visitorType}
            </p>
          )}
        </div>

        {/* Age group — tourists only */}
        {needsAge && (
          <div className="pf-field pf-field--reveal">
            <span className="pf-label" id="pf-age-label">
              Age Group <span className="pf-required" aria-hidden="true">*</span>
            </span>
            <div
              className="pf-segment"
              role="radiogroup"
              aria-labelledby="pf-age-label"
            >
              {AGE_GROUPS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={form.ageGroup === opt.value}
                  className={`pf-segment__btn${form.ageGroup === opt.value ? ' pf-segment__btn--active' : ''}`}
                  onClick={() => handleAgeGroup(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.ageGroup && (
              <p className="pf-error" role="alert">
                <AlertIcon /> {errors.ageGroup}
              </p>
            )}
          </div>
        )}

        {/* Education background */}
        {showEducation && (
          <div className="pf-field pf-field--reveal">
            <span className="pf-label" id="pf-edu-label">
              Education Background <span className="pf-required" aria-hidden="true">*</span>
            </span>
            <GlassSelect
              id="pf-edu"
              labelledBy="pf-edu-label"
              options={educationOptions}
              value={form.education}
              onChange={handleEducation}
              placeholder="Select your education level"
              invalid={!!errors.education}
            />
            {errors.education && (
              <p className="pf-error" role="alert">
                <AlertIcon /> {errors.education}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pf-footer">
        {submitError && (
          <p className="pf-banner" role="alert">
            <AlertIcon /> {submitError}
          </p>
        )}
        <button
          type="submit"
          className="pf-btn pf-btn--primary"
          disabled={submitting}
        >
          {submitting ? <Spinner /> : <ArrowRight />}
          {submitting ? 'Preparing your experience…' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
