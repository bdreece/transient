import type { infer as Infer } from 'zod';
import type { Control, UseFormRegister } from 'react-hook-form';
import type { ExpirationRuleType } from '../../../generated/prisma';
import type { UploadSchema } from '~/schemas/upload';

import dayjs from 'dayjs';
import { chain } from 'lodash';
import { useMemo, useState } from 'react';
import { startCase } from 'lodash';
import { useFieldArray } from 'react-hook-form';
import { FormControl, Select, TextInput } from '../common';

type UploadFormControl = Control<Infer<typeof UploadSchema>>;
type RegisterFunc = UseFormRegister<Infer<typeof UploadSchema>>;

export type ExpirationRuleInputProps = {
    error?: string | undefined;
    control: UploadFormControl;
    register: RegisterFunc;
    expirationRuleTypes: ExpirationRuleType[];
};

export const ExpirationRuleInput: React.FC<ExpirationRuleInputProps> = ({
    error,
    control,
    register,
    expirationRuleTypes,
}) => {
    const playBasedRuleType = expirationRuleTypes?.find(
        ({ name }) => name === 'playBased',
    )!;

    const dateBasedRuleType = expirationRuleTypes?.find(
        ({ name }) => name === 'dateBased',
    )!;

    const { fields, append, remove } = useFieldArray<Infer<typeof UploadSchema>>({
        control,
        name: 'rules',
    });

    const options = useMemo(
        () =>
            chain(expirationRuleTypes)
                .differenceWith(fields, (t, f) => f.typeId === t.id)
                .map(t => [startCase(t.name), t.id] as const)
                .value(),
        [expirationRuleTypes, fields],
    );

    const [expirationRuleType, setExpirationRuleType] = useState<string>(
        playBasedRuleType?.id,
    );

    const onChange: React.ReactEventHandler<HTMLSelectElement> = e =>
        setExpirationRuleType(e.currentTarget.value);

    const onCreate: React.MouseEventHandler<HTMLButtonElement> = _ => {
        console.debug('setting rules...');
        if (expirationRuleType === playBasedRuleType.id) {
            setExpirationRuleType(dateBasedRuleType.id);
            append({
                typeId: playBasedRuleType.id,
                intValue: 0,
            });
        } else {
            setExpirationRuleType(playBasedRuleType.id);
            append({
                typeId: dateBasedRuleType.id,
                dateValue: dayjs().add(1, 'day').toDate()
            });
        }
    };

    return (
        <FormControl
            label='Expiration Rules'
            error={error}
        >
            {id => (
                <>
                    <div className='flex flex-col gap-3 mb-3'>
                        {fields.map((f, i) => {
                            const isPlayBased = f.typeId === playBasedRuleType.id;
                            const path = isPlayBased
                                ? (`rules.${i}.intValue` as const)
                                : (`rules.${i}.dateValue` as const);

                            const inputProps = {
                                ...register(path),
                                ...(isPlayBased
                                    ? {
                                        type: 'number',
                                        min: 1,
                                        step: 1,
                                        max: 999,
                                    }
                                    : {
                                        type: 'date',
                                        min: dayjs().format('YYYY-MM-DD'),
                                        max: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                                    }),
                            };

                            const onDelete: React.MouseEventHandler<
                                HTMLButtonElement
                            > = _ => {
                                console.debug(`deleting rule ${i}...`);
                                remove(i);
                                setExpirationRuleType(fields[i].typeId);
                            };

                            console.log(`rendering rule ${i}`);
                            return (
                                <FormControl
                                    key={f.id}
                                    labelClassName='text-xs mb-0'
                                    label={startCase(
                                        isPlayBased
                                            ? playBasedRuleType.name
                                            : dateBasedRuleType.name,
                                    )}
                                >
                                    {id => (
                                        <div className='input-group flex'>
                                            <TextInput
                                                id={id}
                                                className='flex-1'
                                                {...inputProps}
                                            />
                                            <button
                                                className='btn btn-error'
                                                type='button'
                                                onClick={onDelete}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </FormControl>
                            );
                        })}
                    </div>

                    <div className='input-group w-full'>
                        <Select
                            id={id}
                            value={expirationRuleType}
                            options={options}
                            className='flex-1'
                            onChange={onChange}
                        />
                        <button
                            type='button'
                            className='btn btn-primary'
                            disabled={fields.length == 2}
                            onClick={onCreate}
                        >
                            Add
                        </button>
                    </div>
                </>
            )}
        </FormControl>
    );
};
