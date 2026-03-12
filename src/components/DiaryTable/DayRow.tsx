import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { getLeafEntities } from '@torava/pim-utils';
import type RecommendationShape from '@torava/pim-utils/dist/models/Recommendation';
import type AttributeShape from '@torava/pim-utils/dist/models/Attribute';

import type { Sex, Locale } from '../App';
import type { HeadCell } from './DiaryTable';
import { MealRow } from './MealRow';
import { DayHeadCell } from './DayHeadCell';

interface DayRowProps {
  row: Record<string, string | number | null>;
  sortedRows: Record<string, string | number | null>[];
  recommendations: RecommendationShape[];
  attributes: AttributeShape[];
  sex?: Sex;
  locale?: Locale;
  expanded: Record<number, boolean>;
  onExpand: (expanded: Record<number, boolean>) => void;
  headCells: HeadCell[];
}

export function DayRow({
  row,
  sortedRows,
  recommendations,
  attributes,
  sex,
  locale,
  expanded,
  onExpand,
  headCells,
}: DayRowProps) {
  const leafAttributes = getLeafEntities(attributes);
  return (
    <React.Fragment key={row.id}>
      <TableRow key={row.id}>
        <TableCell
          onClick={() => {
            onExpand({ ...expanded, [Number(row.id)]: !expanded[Number(row.id)] });
          }}
        >
          {expanded[Number(row.id)] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </TableCell>
        {headCells.map((headCell) => (
          <DayHeadCell
            key={headCell.id}
            headCell={headCell}
            row={row}
            attributes={attributes}
            recommendations={recommendations}
            sex={sex}
            locale={locale}
            leafAttributes={leafAttributes}
          />
        ))}
      </TableRow>
      {expanded[Number(row.id)] &&
        sortedRows
          .filter((meal) => meal.parentId === row.id)
          .map((meal) => (
            <MealRow
              key={meal.id}
              day={row}
              meal={meal}
              sortedRows={sortedRows}
              recommendations={recommendations}
              attributes={attributes}
              sex={sex}
              locale={locale}
              expanded={expanded}
              onExpand={onExpand}
              headCells={headCells}
            />
          ))}
    </React.Fragment>
  );
}
