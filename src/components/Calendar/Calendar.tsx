import React, { forwardRef, useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import './Calendar.scss';

export type CalendarMode = 'month' | 'year';

export interface CalendarProps {
  /** Valor controlado de la fecha seleccionada. */
  value?: Dayjs;

  /** Valor inicial por defecto. */
  defaultValue?: Dayjs;

  /** Modo de visualización. @default 'month' */
  mode?: CalendarMode;

  /** Si es `true`, muestra el calendario full-size (panel completo con header). @default true */
  fullscreen?: boolean;

  /** Renderizado personalizado de celdas de fecha. */
  cellRender?: (
    date: Dayjs,
    info: { originNode: React.ReactNode; type: CalendarMode }
  ) => React.ReactNode;

  /** Renderizado personalizado del contenido de celdas (sin reemplazar la celda entera). */
  fullCellRender?: (date: Dayjs, info: { type: CalendarMode }) => React.ReactNode;

  /** Callback cuando cambia la fecha seleccionada. */
  onChange?: (date: Dayjs) => void;

  /** Callback cuando cambia el panel (mes/año visualizado). */
  onPanelChange?: (date: Dayjs, mode: CalendarMode) => void;

  /** Callback cuando cambia el modo. */
  onModeChange?: (mode: CalendarMode) => void;

  /** Función para deshabilitar fechas específicas. */
  disabledDate?: (date: Dayjs) => boolean;

  /** Componente personalizado para el header. */
  headerRender?: (config: {
    value: Dayjs;
    type: CalendarMode;
    onChange: (date: Dayjs) => void;
    onTypeChange: (type: CalendarMode) => void;
  }) => React.ReactNode;

  /** Clases CSS adicionales. */
  className?: string;

  /** Estilos CSS inline. */
  style?: React.CSSProperties;
}

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    value: controlledValue,
    defaultValue,
    mode: controlledMode,
    fullscreen = true,
    cellRender,
    fullCellRender,
    onChange,
    onPanelChange,
    onModeChange,
    disabledDate,
    headerRender,
    className,
    style,
  } = props;

  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('calendar') || getDefaultPrefixCls('calendar');

  const [internalValue, setInternalValue] = useState<Dayjs>(() => defaultValue || dayjs());
  const [internalMode, setInternalMode] = useState<CalendarMode>('month');

  const currentValue = controlledValue ?? internalValue;
  const currentMode = controlledMode ?? internalMode;

  const handleSelect = useCallback(
    (date: Dayjs) => {
      if (disabledDate?.(date)) return;
      if (!controlledValue) setInternalValue(date);
      onChange?.(date);
    },
    [controlledValue, onChange, disabledDate]
  );

  const handlePanelChange = useCallback(
    (date: Dayjs) => {
      if (!controlledValue) setInternalValue(date);
      onPanelChange?.(date, currentMode);
    },
    [controlledValue, currentMode, onPanelChange]
  );

  const handleModeChange = useCallback(
    (mode: CalendarMode) => {
      if (!controlledMode) setInternalMode(mode);
      onModeChange?.(mode);
      onPanelChange?.(currentValue, mode);
    },
    [controlledMode, currentValue, onModeChange, onPanelChange]
  );

  // Calendar grid data
  const weeks = useMemo(() => {
    const startOfMonth = currentValue.startOf('month');
    const endOfMonth = currentValue.endOf('month');
    const startDay = startOfMonth.day(); // 0=Sun
    const gridStart = startOfMonth.subtract(startDay, 'day');

    const rows: Dayjs[][] = [];
    let day = gridStart;
    // Always show 6 weeks for consistent height
    for (let w = 0; w < 6; w++) {
      const week: Dayjs[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(day);
        day = day.add(1, 'day');
      }
      rows.push(week);
    }
    return rows;
  }, [currentValue]);

  // Months grid for year mode (4x3)
  const months = useMemo(() => {
    const rows: number[][] = [];
    for (let r = 0; r < 4; r++) {
      const row: number[] = [];
      for (let c = 0; c < 3; c++) {
        row.push(r * 3 + c);
      }
      rows.push(row);
    }
    return rows;
  }, []);

  const today = useMemo(() => dayjs(), []);

  // Year/month navigation
  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDate = currentValue.year(Number(e.target.value));
      handlePanelChange(newDate);
    },
    [currentValue, handlePanelChange]
  );

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDate = currentValue.month(Number(e.target.value));
      handlePanelChange(newDate);
    },
    [currentValue, handlePanelChange]
  );

  const yearOptions = useMemo(() => {
    const currentYear = currentValue.year();
    const years: number[] = [];
    for (let y = currentYear - 10; y <= currentYear + 10; y++) {
      years.push(y);
    }
    return years;
  }, [currentValue]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-full`]: fullscreen,
      [`${prefixCls}-mini`]: !fullscreen,
    },
    className
  );

  // Default header
  const renderHeader = () => {
    if (headerRender) {
      return headerRender({
        value: currentValue,
        type: currentMode,
        onChange: handlePanelChange,
        onTypeChange: handleModeChange,
      });
    }

    return (
      <div className={`${prefixCls}-header`}>
        <div className={`${prefixCls}-header-left`} />
        <div className={`${prefixCls}-header-right`}>
          <select
            className={`${prefixCls}-year-select`}
            value={currentValue.year()}
            onChange={handleYearChange}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {currentMode === 'month' && (
            <select
              className={`${prefixCls}-month-select`}
              value={currentValue.month()}
              onChange={handleMonthChange}
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i}>
                  {name}
                </option>
              ))}
            </select>
          )}
          <div className={`${prefixCls}-mode-switch`}>
            <button
              type="button"
              className={classNames(`${prefixCls}-mode-btn`, {
                [`${prefixCls}-mode-btn-active`]: currentMode === 'month',
              })}
              onClick={() => handleModeChange('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={classNames(`${prefixCls}-mode-btn`, {
                [`${prefixCls}-mode-btn-active`]: currentMode === 'year',
              })}
              onClick={() => handleModeChange('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>
    );
  };

  const isToday = (date: Dayjs) =>
    date.year() === today.year() && date.month() === today.month() && date.date() === today.date();

  const isSelected = (date: Dayjs) =>
    date.year() === currentValue.year() &&
    date.month() === currentValue.month() &&
    date.date() === currentValue.date();

  const isCurrentMonth = (date: Dayjs) => date.month() === currentValue.month();

  const renderMonthBody = () => (
    <table className={`${prefixCls}-table`}>
      <thead>
        <tr>
          {WEEK_DAYS.map((d) => (
            <th key={d} className={`${prefixCls}-column-header`}>
              {d}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, wi) => (
          <tr key={wi}>
            {week.map((date, di) => {
              const inMonth = isCurrentMonth(date);
              const selected = isSelected(date);
              const todayCell = isToday(date);
              const disabled = disabledDate?.(date);

              const cellCls = classNames(`${prefixCls}-cell`, {
                [`${prefixCls}-cell-in-view`]: inMonth,
                [`${prefixCls}-cell-selected`]: selected,
                [`${prefixCls}-cell-today`]: todayCell,
                [`${prefixCls}-cell-disabled`]: disabled,
              });

              const dateNode = <span className={`${prefixCls}-date-value`}>{date.date()}</span>;
              const contentNode = cellRender
                ? cellRender(date, { originNode: dateNode, type: 'month' })
                : null;

              if (fullCellRender) {
                return (
                  <td key={di} className={cellCls} onClick={() => handleSelect(date)}>
                    {fullCellRender(date, { type: 'month' })}
                  </td>
                );
              }

              return (
                <td key={di} className={cellCls} onClick={() => handleSelect(date)}>
                  <div className={`${prefixCls}-date`}>
                    {dateNode}
                    <div className={`${prefixCls}-date-content`}>{contentNode}</div>
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderYearBody = () => (
    <div className={`${prefixCls}-month-panel`}>
      {months.map((row, ri) => (
        <div key={ri} className={`${prefixCls}-month-row`}>
          {row.map((m) => {
            const monthDate = currentValue.month(m);
            const selected = m === currentValue.month();
            const todayMonth = m === today.month() && currentValue.year() === today.year();

            const cellCls = classNames(`${prefixCls}-month-cell`, {
              [`${prefixCls}-month-cell-selected`]: selected,
              [`${prefixCls}-month-cell-today`]: todayMonth,
            });

            const monthNode = <span>{monthNames[m]}</span>;
            const contentNode = cellRender
              ? cellRender(monthDate, { originNode: monthNode, type: 'year' })
              : null;

            return (
              <div
                key={m}
                className={cellCls}
                onClick={() => {
                  const newDate = currentValue.month(m);
                  handlePanelChange(newDate);
                  handleModeChange('month');
                }}
              >
                <div className={`${prefixCls}-month-cell-inner`}>
                  {monthNode}
                  {contentNode && <div className={`${prefixCls}-date-content`}>{contentNode}</div>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={classes} style={style}>
      {renderHeader()}
      <div className={`${prefixCls}-body`}>
        {currentMode === 'month' ? renderMonthBody() : renderYearBody()}
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';
