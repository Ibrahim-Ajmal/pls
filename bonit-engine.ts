
type EngineResult = {
  subject: string;
  result: string;
};

const atomicMasses: Record<string, number> = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122,
  B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305,
  Al: 26.982, Si: 28.085, P: 30.974, S: 32.06,
  Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078,
  Fe: 55.845, Cu: 63.546, Zn: 65.38, Br: 79.904,
  Ag: 107.868, I: 126.904, Ba: 137.327,
  Au: 196.967, Hg: 200.592, Pb: 207.2
};

function chemistry(formula: string): string | null {
  const tokens = formula.match(/[A-Z][a-z]?|\d+|[()]/g);

  if (!tokens || tokens.join("") !== formula) return null;

  const stack: Record<string, number>[] = [{}];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === "(") {
      stack.push({});
    } else if (token === ")") {
      if (stack.length === 1) return null;

      const group = stack.pop()!;
      const multiplier = Number(tokens[i + 1] || 1);

      if (!Number.isFinite(multiplier)) return null;
      if (tokens[i + 1] && /^\d+$/.test(tokens[i + 1])) i++;

      for (const [element, count] of Object.entries(group)) {
        const parent = stack[stack.length - 1];
        parent[element] = (parent[element] || 0) + count * multiplier;
      }
    } else if (/^[A-Z]/.test(token)) {
      if (!(token in atomicMasses)) return null;

      const multiplier = Number(tokens[i + 1] || 1);

      if (tokens[i + 1] && /^\d+$/.test(tokens[i + 1])) i++;

      const current = stack[stack.length - 1];
      current[token] = (current[token] || 0) + multiplier;
    } else {
      return null;
    }
  }

  if (stack.length !== 1) return null;

  const elements = stack[0];
  const mass = Object.entries(elements).reduce(
    (total, [element, count]) =>
      total + atomicMasses[element] * count,
    0
  );

  const breakdown = Object.entries(elements)
    .map(([element, count]) =>
      `${element}: ${count} × ${atomicMasses[element]}`
    )
    .join("\n");

  return `Formula: ${formula}\n\nElement breakdown:\n${breakdown}\n\nMolar mass: ${mass.toFixed(4)} g/mol`;
}

function physics(text: string): string | null {
  const force = text.match(
    /mass\s*(?:of)?\s*([\d.]+)\s*kg[\s\S]*?acceleration\s*(?:of)?\s*([\d.]+)\s*m\/s(?:\^?2|²)?/i
  );

  if (force) {
    const mass = Number(force[1]);
    const acceleration = Number(force[2]);
    const result = mass * acceleration;

    return `Newton's Second Law\n\nF = m × a\nF = ${mass} × ${acceleration}\nForce = ${result} N`;
  }

  const speed = text.match(
    /distance\s*(?:of)?\s*([\d.]+)\s*(km|m)\s*[\s\S]*?time\s*(?:of)?\s*([\d.]+)\s*(hours?|hrs?|seconds?|secs?|minutes?|mins?)/i
  );

  if (speed) {
    const distance = Number(speed[1]);
    const distanceUnit = speed[2].toLowerCase();
    const time = Number(speed[3]);
    const timeUnit = speed[4].toLowerCase();

    const distanceMeters = distanceUnit === "km"
      ? distance * 1000 : distance;

    const timeSeconds = timeUnit.startsWith("h")
      ? time * 3600
      : timeUnit.startsWith("m")
        ? time * 60 : time;

    if (timeSeconds <= 0) return null;

    const result = distanceMeters / timeSeconds;

    return `Speed calculation\n\nSpeed = Distance ÷ Time\nSpeed = ${result.toFixed(3)} m/s\nSpeed = ${(result * 3.6).toFixed(3)} km/h`;
  }

  return null;
}

function aviation(text: string): string | null {
  const knots = text.match(
    /([\d.]+)\s*(?:knots?|kt)\s*(?:to|in|into)\s*(?:km\/?h|kilometers? per hour)/i
  );

  if (knots) {
    const value = Number(knots[1]);
    const result = value * 1.852;

    return `Aviation speed conversion\n\n${value} knots × 1.852\n= ${result.toFixed(2)} km/h\n\nThis is a unit conversion, not an aircraft performance calculation.`;
  }

  const nm = text.match(
    /([\d.]+)\s*(?:nautical miles?|nm)\s*(?:to|in|into)\s*(?:km|kilometers?)/i
  );

  if (nm) {
    const value = Number(nm[1]);
    const result = value * 1.852;

    return `${value} nautical miles = ${result.toFixed(2)} km`;
  }

  const km = text.match(
    /([\d.]+)\s*km\s*(?:to|in|into)\s*(?:nautical miles?|nm)/i
  );

  if (km) {
    const value = Number(km[1]);
    const result = value / 1.852;

    return `${value} km = ${result.toFixed(2)} nautical miles`;
  }

  return null;
}

function evaluateArithmetic(expression: string): number {
  const source = expression.replace(/\s/g, "");
  const tokens = source.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[()+\-*/^%]/gi);

  if (!tokens || tokens.join("") !== source) {
    throw new Error("Invalid arithmetic expression");
  }

  let position = 0;

  const parseExpression = (): number => {
    let value = parseTerm();
    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position++];
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  };

  const parseTerm = (): number => {
    let value = parseUnary();
    while (["*", "/", "%"].includes(tokens[position])) {
      const operator = tokens[position++];
      const right = parseUnary();
      value = operator === "*" ? value * right : operator === "/" ? value / right : value % right;
    }
    return value;
  };

  const parseUnary = (): number => {
    if (tokens[position] === "+") {
      position++;
      return parseUnary();
    }
    if (tokens[position] === "-") {
      position++;
      return -parseUnary();
    }
    return parsePower();
  };

  const parsePower = (): number => {
    const value = parsePrimary();
    if (tokens[position] === "^") {
      position++;
      return value ** parseUnary();
    }
    return value;
  };

  const parsePrimary = (): number => {
    const token = tokens[position++];
    if (token === "(") {
      const value = parseExpression();
      if (tokens[position++] !== ")") throw new Error("Unmatched parenthesis");
      return value;
    }
    if (!token || !/^((\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)$/i.test(token)) {
      throw new Error("Expected a number");
    }
    return Number(token);
  };

  const value = parseExpression();
  if (position !== tokens.length) throw new Error("Unexpected token");
  return value;
}

export function calculateSpecialist(
  input: string
): EngineResult | null {
  const text = input.trim();

  if (!text || text.length > 500) return null;

  // Aviation
  if (
    /\b(aviation|aircraft|pilot|knots?|nautical miles?|flight speed)\b/i.test(text)
  ) {
    const result = aviation(text);
    if (result) return { subject: "Aviation", result };
  }

  // Chemistry
  const formulaMatch = text.match(
    /(?:molar mass|molecular mass|molecular weight)\s*(?:of)?\s*([A-Z][A-Za-z0-9()]*)/i
  );

  if (formulaMatch) {
    const result = chemistry(formulaMatch[1]);
    if (result) return { subject: "Chemistry", result };
  }

  // Physics
  if (/\b(physics|force|acceleration|speed|distance|time)\b/i.test(text)) {
    const result = physics(text);
    if (result) return { subject: "Physics", result };
  }

  // Mathematics
  const expression = text
    .replace(/,/g, "")
    .replace(/^(what is|calculate|solve|evaluate)\s*/i, "")
    .replace(/\?$/, "")
    .trim();

  const isMathExpression =
    /[+\-*/^%]/.test(expression) &&
    /^[0-9a-zA-Z+\-*/^%().,\s]+$/.test(expression) &&
    !/[=;]/.test(expression) &&
    expression.length <= 150;

  if (isMathExpression) {
    try {
      const value = evaluateArithmetic(expression);

      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        return {
          subject: "Mathematics",
          result: `${expression} = ${value}`
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}
