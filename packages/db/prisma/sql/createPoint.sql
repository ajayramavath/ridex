-- @param {Float} $1:longitude
-- @param {Float} $2:latitude
-- @param {String} $3:geohash6
-- @param {String} $4:geohash7
-- @param {String} $5:geohash8
-- @param {String} $6:geohash_full
-- @param {String} $7:place_id
-- @param {String} $8:city
-- @param {String} $9:short_address
-- @param {String} $10:full_address
-- @param {String} $11:premise?
-- @param {String} $12:postal_code?
-- @param {String} $13:uuid

WITH ins AS (
  INSERT INTO "Point" (
    location,
    geohash6, geohash7, geohash8, geohash_full,
    place_id, city, short_address, full_address, premise, postal_code, id
  )
  VALUES (
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
    $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13
  )
  ON CONFLICT (place_id) DO NOTHING
  RETURNING id
)
SELECT id
FROM ins

UNION ALL

SELECT id
FROM "Point"
WHERE place_id = $7

LIMIT 1;
