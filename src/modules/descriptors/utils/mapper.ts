import { Injectable } from '@nestjs/common';
import { GetItemsParams } from '../dto/get-items.params';
import {
  FieldValueType,
  ImageType,
  ItemFieldsContent,
  ItemListResponse,
} from '../dto/responses/item-list.response';
import {
  IFieldValueModel,
  IImageModel,
  IValueTraductionModel,
  ValueFieldType,
} from '../interfaces/item.models';
import { FieldModel } from '../schemas/Field.schema';
import { ItemModel } from '../schemas/Item.schema';

@Injectable()
export class Mapper {
  mapItems(
    itemList: ItemModel[],
    fieldList: FieldModel[],
    params: GetItemsParams,
  ) {
    // const itemResult: ItemListResponse[];

    for (const item of itemList) {
      let fieldResult: ItemFieldsContent[];
      for (const field of item.fields) {
        const fieldFiltered = fieldList.find((i) => i._id == field.fieldId);

        const valueField = this.getFieldValue(fieldFiltered.typeField, {
          value: field.value,
          language: params.language,
          country: params.country,
        });

        if (valueField != null)
          fieldResult.push({
            _id: fieldFiltered._id.toString(),
            name: fieldFiltered.name.toString(),
            value: valueField,
            type: fieldFiltered.typeField,
          });
      }
    }
  }

  private getFieldValue(type: String, data: paramsValueMapper): FieldValueType {
    switch (type) {
      case 'RICH_TEXT':
        return this.rich_text_map(data);
      case 'IMAGE':
        return this.image_map(data);
    }
  }

  private rich_text_map(data: paramsValueMapper): string {
    const values = <IValueTraductionModel[]>data.value;

    const value = values.find(
      (value) =>
        value.language == data.language &&
        value.countries.includes(data.country),
    );

    return value?.value;
  }

  private image_map(data: paramsValueMapper): ImageType[] {
    const values = <IImageModel[]>data.value;

    const images = values.filter((image) =>
      image.traduction.some(
        (traduction) => traduction.language == data.language,
      ),
    ).map(image => ({name: }));

    // const value = values.find(
    //   (value) =>
    //     value.language == data.language &&
    //     value.countries.includes(data.country),
    // );

    if (!value) return null;

    return [];
  }
}

interface paramsValueMapper {
  language: string;
  country: string;
  value: ValueFieldType;
}
