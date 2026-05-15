import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  productId: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  handle: string;

  @Prop()
  body_html: string;

  @Prop()
  vendor: string;

  @Prop()
  product_type: string;

  @Prop([String])
  tags: string[];

  @Prop({ type: [Object] })
  variants: any[];

  @Prop({ type: [Object] })
  images: any[];

  @Prop({ type: [Object] })
  options: any[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
