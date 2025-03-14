declare module 'd3-selection' {
  export interface BaseType extends Element {}

  export interface Selection<
    GElement extends BaseType = BaseType,
    Datum = unknown,
    PElement extends BaseType = BaseType,
    PDatum = unknown
  > {
    select(selector: string): Selection<GElement, Datum, PElement, PDatum>;
    selectAll<NewGElement extends BaseType = BaseType, NewDatum = unknown>(
      selector: string
    ): Selection<NewGElement, NewDatum, GElement, Datum>;
    append<NewGElement extends BaseType = BaseType>(
      type: string
    ): Selection<NewGElement, Datum, PElement, PDatum>;
    remove(): this;
    data<NewDatum>(
      data: NewDatum[],
      key?: (d: NewDatum | Datum, i: number, nodes: ArrayLike<GElement>) => string
    ): Selection<GElement, NewDatum, PElement, PDatum>;
    join<NewGElement extends BaseType = GElement>(
      enter: string | ((enter: Selection<null, Datum, PElement, PDatum>) => Selection<NewGElement, Datum, PElement, PDatum>)
    ): Selection<NewGElement | GElement, Datum, PElement, PDatum>;
    attr(name: string, value: string | number | boolean | ((d: Datum, i: number) => string | number | boolean)): this;
    style(name: string, value: string | number | boolean | ((d: Datum, i: number) => string | number | boolean)): this;
    text(value: string | ((d: Datum, i: number) => string)): this;
    html(value: string | ((d: Datum, i: number) => string)): this;
    on(type: string, listener: (event: any, d: Datum) => void): this;
    transition(): this;
    call<T extends BaseType, U>(fn: (selection: Selection<T, any, any, any>, ...args: U[]) => void, ...args: U[]): this;
    each(fn: (d: Datum, i: number, nodes: ArrayLike<GElement>) => void): this;
  }

  export function select(selector: string | Element): Selection<Element, unknown, null, undefined>;
  export function selectAll(selector: string): Selection<Element, unknown, null, undefined>;
}

declare module 'd3-force' {
  export interface SimulationNodeDatum {
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    index?: number;
    vx?: number;
    vy?: number;
  }

  export interface ForceLink<NodeDatum extends SimulationNodeDatum, LinkDatum> {
    links(): LinkDatum[];
    links(links: LinkDatum[]): this;
    id(): (node: NodeDatum) => string;
    id(id: (node: NodeDatum) => string): this;
    distance(): number | ((link: LinkDatum) => number);
    distance(distance: number | ((link: LinkDatum) => number)): this;
    strength(): number | ((link: LinkDatum) => number);
    strength(strength: number | ((link: LinkDatum) => number)): this;
  }

  export interface Force<NodeDatum extends SimulationNodeDatum, LinkDatum = undefined> {
    (alpha: number): void;
    strength(strength: number): this;
    strength(strength: (d: NodeDatum) => number): this;
    radius(radius: number): this;
    radius(radius: (d: NodeDatum) => number): this;
    distance(distance: number): this;
    distance(distance: (d: NodeDatum) => number): this;
  }

  export interface Simulation<NodeDatum extends SimulationNodeDatum, LinkDatum = undefined> {
    nodes(): NodeDatum[];
    nodes(nodes: NodeDatum[]): this;
    alpha(): number;
    alpha(alpha: number): this;
    alphaMin(): number;
    alphaMin(min: number): this;
    alphaDecay(): number;
    alphaDecay(decay: number): this;
    alphaTarget(): number;
    alphaTarget(target: number): this;
    velocityDecay(): number;
    velocityDecay(decay: number): this;
    force(name: string): Force<NodeDatum, LinkDatum> | undefined;
    force(name: string, force: Force<NodeDatum, LinkDatum> | null): this;
    find(x: number, y: number, radius?: number): NodeDatum | undefined;
    on(typenames: string, listener: ((this: Simulation<NodeDatum, LinkDatum>) => void) | null): this;
    tick(): void;
    restart(): this;
    stop(): this;
  }

  export function forceSimulation<NodeDatum extends SimulationNodeDatum>(nodes?: NodeDatum[]): Simulation<NodeDatum, undefined>;
  export function forceLink<NodeDatum extends SimulationNodeDatum, LinkDatum>(): ForceLink<NodeDatum, LinkDatum>;
  export function forceManyBody<NodeDatum extends SimulationNodeDatum>(): Force<NodeDatum, any>;
  export function forceX<NodeDatum extends SimulationNodeDatum>(x?: number | ((d: NodeDatum) => number)): Force<NodeDatum, any>;
  export function forceY<NodeDatum extends SimulationNodeDatum>(y?: number | ((d: NodeDatum) => number)): Force<NodeDatum, any>;
  export function forceCollide<NodeDatum extends SimulationNodeDatum>(radius?: number | ((d: NodeDatum) => number)): Force<NodeDatum, any>;
  export function forceCenter<NodeDatum extends SimulationNodeDatum>(x?: number, y?: number): Force<NodeDatum, any>;
  export function forceRadial<NodeDatum extends SimulationNodeDatum>(radius: number, x?: number, y?: number): Force<NodeDatum, any>;
}

declare module 'd3-scale' {
  export interface ScaleOrdinal<Domain extends { toString(): string } = string, Range = any> {
    (value: Domain): Range;
    domain(): Domain[];
    domain(domain: Domain[]): this;
    range(): Range[];
    range(range: Range[]): this;
  }

  export interface ScaleSequential<Range = any> {
    (value: number): Range;
    domain(): [number, number];
    domain(domain: [number, number]): this;
    interpolator(): (t: number) => Range;
    interpolator(interpolator: (t: number) => Range): this;
  }

  export function scaleOrdinal<Domain extends { toString(): string } = string, Range = any>(): ScaleOrdinal<Domain, Range>;
  export function scaleSequential<Range = any>(): ScaleSequential<Range>;
}

declare module 'd3-shape' {
  export interface Arc<Datum> {
    (d: Datum): string | undefined;
    innerRadius(): number | ((d: Datum) => number);
    innerRadius(radius: number | ((d: Datum) => number)): this;
    outerRadius(): number | ((d: Datum) => number);
    outerRadius(radius: number | ((d: Datum) => number)): this;
    startAngle(): number | ((d: Datum) => number);
    startAngle(angle: number | ((d: Datum) => number)): this;
    endAngle(): number | ((d: Datum) => number);
    endAngle(angle: number | ((d: Datum) => number)): this;
  }

  export function arc<Datum>(): Arc<Datum>;
}

declare module 'd3-interpolate' {
  export function interpolate(a: any, b: any): (t: number) => any;
}

declare module 'd3-scale-chromatic' {
  export function interpolateRainbow(t: number): string;
}

declare module 'd3-sankey' {
  export interface SankeyNode<N> extends SimulationNodeDatum {
    sourceLinks: Array<SankeyLink<N>>;
    targetLinks: Array<SankeyLink<N>>;
    value: number;
  }

  export interface SankeyLink<N> {
    source: N;
    target: N;
    value: number;
  }

  export interface SankeyLayout<N, L> {
    nodeWidth(): number;
    nodeWidth(w: number): this;
    nodePadding(): number;
    nodePadding(p: number): this;
    extent(): [[number, number], [number, number]];
    extent(e: [[number, number], [number, number]]): this;
    (data: { nodes: N[], links: L[] }): { nodes: N[], links: L[] };
  }

  export function sankey<N, L>(): SankeyLayout<N, L>;
  export function sankeyLinkHorizontal(): (d: any) => string;
}

declare module 'd3-drag' {
  export interface DragBehavior<Element extends BaseType, Datum, Subject> {
    (selection: Selection<Element, Datum, any, any>): void;
    on(typenames: string, listener: ((event: any, d: Datum) => void) | null): this;
    subject(subject: ((this: Element, event: any, d: Datum) => Subject) | Subject): this;
  }

  export function drag<Element extends BaseType = BaseType, Datum = unknown, Subject = unknown>(): DragBehavior<Element, Datum, Subject>;
}
