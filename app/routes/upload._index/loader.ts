import type { LoaderArgs } from '@remix-run/node';

import { json } from '@remix-run/node';
import { db } from '../../../server/services/db';

export const loader = async (_: LoaderArgs) => {
  console.log('querying expiration rule types...');
  const expirationTypes = await db.expirationRuleType.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  console.dir(expirationTypes);
  return json(expirationTypes);
};
