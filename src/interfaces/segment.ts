import { IVector2 } from './math';

export enum SegmentClassId {
    Line = 'segment.linesegment',
    Arc = 'segment.arcsegment',
}

export interface LineSegment {
    classId: SegmentClassId.Line;
    endPoints: [IVector2, IVector2];
}

export interface ArcSegment {
    classId: SegmentClassId.Arc;
    startAngle: number;
    endAngle: number;
    radius: number;
    centerPoint: IVector2;
}
