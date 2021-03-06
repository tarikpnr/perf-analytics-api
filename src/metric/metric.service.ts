import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Metric } from './metric-model.schema';

@Injectable()
export class MetricService {
  constructor(@InjectModel(Metric.name) private metricModel: Model<Metric>) {}

  /**
   *
   * @param data
   * @returns created metric
   */
  async createMetrics(data: Metric) {
    const createdMetricModel = new this.metricModel(data);
    return createdMetricModel.save();
  }

  /**
   *
   * @param startDate
   * @param endDate
   * @returns found metrics
   */
  async getMetricsByDate(
    startDate: string,
    endDate: string,
  ): Promise<Metric[]> {
    return this.metricModel
      .find({
        createdAt: {
          $gte: new Date(Number(startDate)),
          $lte: new Date(Number(endDate)),
        },
      })
      .sort('-createdAt');
  }

  /**
   *
   * @param startDate
   * @param endDate
   * @returns latest metrics
   * @description returns latest metrics that are created within last 30 mins
   */
  async getLatestMetrics(): Promise<Metric[]> {
    return this.metricModel
      .find()
      .where('createdAt')
      .gte(new Date(Date.now() - 1000 * 60 * 30).getTime())
      .sort('-createdAt');
  }

  /**
   * @returns all metrics
   */
  async getAllMetrics(): Promise<Metric[]> {
    return this.metricModel.find().sort('-createdAt');
  }
}
