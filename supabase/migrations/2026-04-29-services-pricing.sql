-- =====================================================================
-- Update services pricing on existing rows + introduce USD fallback labels
-- ---------------------------------------------------------------------
-- Idempotent. Safe to re-run. The original 2026-04-28-services.sql now
-- bakes the new prices into its DEFAULT clauses, but rows that were
-- already inserted before this update need an explicit UPDATE to pick
-- them up. We rebuild the tiers JSONB by merging the new price labels
-- into whatever the row currently holds, so any other admin edits to
-- copy / features / CTA text are preserved.
-- =====================================================================

UPDATE services_settings
SET tiers = jsonb_build_array(
  COALESCE(tiers->0, '{}'::jsonb)
    || jsonb_build_object(
         'price_label',     '₹4,999',
         'price_label_usd', '$1,111'
       ),
  COALESCE(tiers->1, '{}'::jsonb)
    || jsonb_build_object(
         'price_label',     '₹11,111',
         'price_label_usd', '$2,499'
       )
)
WHERE id = 1;
