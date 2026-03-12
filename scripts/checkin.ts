#!/usr/bin/env bun

import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

type CheckinQuality = "bad" | "ok" | "good";
type MoodValue = 1 | 2 | 3 | 4 | 5;

type CheckinPayload = {
  date?: string;
  mood: MoodValue;
  stressLevel: MoodValue;
  sleepHours: number;
  coffeeCups: number;
  lastCoffeeAt: string | null;
  hadLateMeal: boolean;
  sleepQuality: CheckinQuality;
  productivity: CheckinQuality;
  energyLevel: CheckinQuality;
};

type ParsedFlags = {
  help: boolean;
  interactive: boolean;
  baseUrl?: string;
  writeToken?: string;
  date?: string;
  mood?: string;
  stress?: string;
  sleepHours?: string;
  coffeeCups?: string;
  lastCoffee?: string;
  lateMeal?: string;
  sleepQuality?: string;
  productivity?: string;
  energy?: string;
};

const QUALITY_VALUES = new Set<CheckinQuality>(["bad", "ok", "good"]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/u;

const usageText = `track-shan check-in CLI

Usage:
  bun run checkin --interactive
  bun run checkin --mood 4 --stress 2 --sleep-hours 7.5 --coffee-cups 2 --last-coffee 14:30 --late-meal no --sleep-quality good --productivity ok --energy good

Flags:
  --interactive, -i          Prompt mode (recommended)
  --base-url <url>           App base URL (default: TRACK_SHAN_BASE_URL or http://localhost:3000)
  --write-token <token>      Optional write token sent as x-write-token header (default: TRACK_SHAN_WRITE_TOKEN)
  --date <YYYY-MM-DD>        Date (default: today)
  --mood <1-5>
  --stress <1-5>
  --sleep-hours <0-24>
  --coffee-cups <0-20>
  --last-coffee <HH:MM>      Required only when coffee-cups > 0
  --late-meal <yes|no>
  --sleep-quality <bad|ok|good>
  --productivity <bad|ok|good>
  --energy <bad|ok|good>
  --help, -h
`;

const todayDateString = (): string => new Date().toISOString().split("T")[0] ?? "";

const getRequiredValue = (args: string[], index: number, flag: string): string => {
  const value = args[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
};

const parseArgs = (args: string[]): ParsedFlags => {
  const parsed: ParsedFlags = {
    help: false,
    interactive: false,
  };

  let index = 0;

  while (index < args.length) {
    const arg = args[index];

    switch (arg) {
      case "--help":
      case "-h":
        parsed.help = true;
        index += 1;
        break;
      case "--interactive":
      case "-i":
        parsed.interactive = true;
        index += 1;
        break;
      case "--base-url":
        parsed.baseUrl = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--write-token":
        parsed.writeToken = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--date":
        parsed.date = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--mood":
        parsed.mood = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--stress":
        parsed.stress = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--sleep-hours":
        parsed.sleepHours = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--coffee-cups":
        parsed.coffeeCups = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--last-coffee":
        parsed.lastCoffee = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--late-meal":
        parsed.lateMeal = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--sleep-quality":
        parsed.sleepQuality = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--productivity":
        parsed.productivity = getRequiredValue(args, index, arg);
        index += 2;
        break;
      case "--energy":
        parsed.energy = getRequiredValue(args, index, arg);
        index += 2;
        break;
      default:
        throw new Error(`Unknown flag: ${arg}`);
    }
  }

  return parsed;
};

const parseMood = (value: string, label: string): MoodValue => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    throw new Error(`${label} must be an integer between 1 and 5`);
  }
  return parsed as MoodValue;
};

const parseSleepHours = (value: string): number => {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 24) {
    throw new Error("sleep-hours must be a number between 0 and 24");
  }
  return parsed;
};

const parseCoffeeCups = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 20) {
    throw new Error("coffee-cups must be an integer between 0 and 20");
  }
  return parsed;
};

const parseQuality = (value: string, label: string): CheckinQuality => {
  if (!QUALITY_VALUES.has(value as CheckinQuality)) {
    throw new Error(`${label} must be one of: bad, ok, good`);
  }
  return value as CheckinQuality;
};

const parseYesNo = (value: string, label: string): boolean => {
  const normalized = value.trim().toLowerCase();
  if (["yes", "y", "true", "1"].includes(normalized)) return true;
  if (["no", "n", "false", "0"].includes(normalized)) return false;
  throw new Error(`${label} must be yes or no`);
};

const parseDate = (value: string): string => {
  if (!DATE_PATTERN.test(value)) {
    throw new Error("date must be in YYYY-MM-DD format");
  }
  return value;
};

const parseTime = (value: string): string => {
  if (!TIME_PATTERN.test(value)) {
    throw new Error("time must be in HH:MM (24h) format");
  }
  return value;
};

const hasAnyDataFlags = (flags: ParsedFlags): boolean =>
  [
    flags.date,
    flags.mood,
    flags.stress,
    flags.sleepHours,
    flags.coffeeCups,
    flags.lastCoffee,
    flags.lateMeal,
    flags.sleepQuality,
    flags.productivity,
    flags.energy,
  ].some((value) => value !== undefined);

const requireFlag = (value: string | undefined, name: string): string => {
  if (value === undefined) {
    throw new Error(`Missing --${name}. Use --interactive for prompt mode.`);
  }
  return value;
};

const buildPayloadFromFlags = (flags: ParsedFlags): CheckinPayload => {
  const date = flags.date ? parseDate(flags.date) : todayDateString();
  const mood = parseMood(requireFlag(flags.mood, "mood"), "mood");
  const stressLevel = parseMood(requireFlag(flags.stress, "stress"), "stress");
  const sleepHours = parseSleepHours(requireFlag(flags.sleepHours, "sleep-hours"));
  const coffeeCups = parseCoffeeCups(requireFlag(flags.coffeeCups, "coffee-cups"));
  const hadLateMeal = parseYesNo(requireFlag(flags.lateMeal, "late-meal"), "late-meal");
  const sleepQuality = parseQuality(
    requireFlag(flags.sleepQuality, "sleep-quality"),
    "sleep-quality",
  );
  const productivity = parseQuality(
    requireFlag(flags.productivity, "productivity"),
    "productivity",
  );
  const energyLevel = parseQuality(requireFlag(flags.energy, "energy"), "energy");

  if (coffeeCups > 0 && !flags.lastCoffee) {
    throw new Error("Missing --last-coffee when coffee-cups is greater than 0");
  }

  if (coffeeCups === 0 && flags.lastCoffee) {
    throw new Error("--last-coffee should be omitted when coffee-cups is 0");
  }

  const lastCoffeeAt = flags.lastCoffee ? parseTime(flags.lastCoffee) : null;

  return {
    date,
    mood,
    stressLevel,
    sleepHours,
    coffeeCups,
    lastCoffeeAt,
    hadLateMeal,
    sleepQuality,
    productivity,
    energyLevel,
  };
};

const promptWithDefault = async (
  rl: ReturnType<typeof createInterface>,
  label: string,
  defaultValue: string,
): Promise<string> => {
  const answer = (await rl.question(`${label} [${defaultValue}]: `)).trim();
  return answer || defaultValue;
};

const askUntilValid = async <T>(
  rl: ReturnType<typeof createInterface>,
  label: string,
  defaultValue: string,
  parser: (value: string) => T,
): Promise<T> => {
  while (true) {
    const rawValue = await promptWithDefault(rl, label, defaultValue);
    try {
      return parser(rawValue);
    } catch (error) {
      console.error(`❌ ${error instanceof Error ? error.message : "Invalid value"}`);
    }
  }
};

const buildPayloadInteractively = async (): Promise<CheckinPayload> => {
  const rl = createInterface({ input, output });

  try {
    console.log("\n🧙 track-shan quick check-in\n");

    const date = await askUntilValid(rl, "Date (YYYY-MM-DD)", todayDateString(), parseDate);
    const mood = await askUntilValid(rl, "Mood (1-5)", "3", (value) =>
      parseMood(value, "mood"),
    );
    const stressLevel = await askUntilValid(rl, "Stress (1-5)", "3", (value) =>
      parseMood(value, "stress"),
    );
    const sleepHours = await askUntilValid(rl, "Sleep hours (0-24)", "7.5", parseSleepHours);
    const coffeeCups = await askUntilValid(rl, "Coffee cups (0-20)", "0", parseCoffeeCups);
    const lastCoffeeAt =
      coffeeCups > 0
        ? await askUntilValid(rl, "Last coffee (HH:MM)", "14:30", parseTime)
        : null;
    const hadLateMeal = await askUntilValid(rl, "Late meal? (yes/no)", "no", (value) =>
      parseYesNo(value, "late-meal"),
    );
    const sleepQuality = await askUntilValid(rl, "Sleep quality (bad|ok|good)", "ok", (value) =>
      parseQuality(value, "sleep-quality"),
    );
    const productivity = await askUntilValid(rl, "Productivity (bad|ok|good)", "ok", (value) =>
      parseQuality(value, "productivity"),
    );
    const energyLevel = await askUntilValid(rl, "Energy (bad|ok|good)", "ok", (value) =>
      parseQuality(value, "energy"),
    );

    return {
      date,
      mood,
      stressLevel,
      sleepHours,
      coffeeCups,
      lastCoffeeAt,
      hadLateMeal,
      sleepQuality,
      productivity,
      energyLevel,
    };
  } finally {
    rl.close();
  }
};

const getBaseUrl = (flags: ParsedFlags): string => {
  const baseUrl = flags.baseUrl ?? process.env.TRACK_SHAN_BASE_URL ?? "http://localhost:3000";

  try {
    return new URL(baseUrl).toString();
  } catch {
    throw new Error(`Invalid base URL: ${baseUrl}`);
  }
};

const submitCheckin = async (payload: CheckinPayload, flags: ParsedFlags): Promise<void> => {
  const endpoint = new URL("/api/checkin", getBaseUrl(flags)).toString();
  const writeToken = flags.writeToken ?? process.env.TRACK_SHAN_WRITE_TOKEN;

  const headers: HeadersInit = {
    "content-type": "application/json",
  };

  if (writeToken) {
    headers["x-write-token"] = writeToken;
  }

  const response = await fetch(endpoint, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  const responseBody = await response.text();

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${responseBody}`);
  }

  console.log(`✅ Saved check-in for ${payload.date ?? todayDateString()}`);
};

const main = async (): Promise<void> => {
  const flags = parseArgs(process.argv.slice(2));

  if (flags.help) {
    console.log(usageText);
    return;
  }

  const payload =
    flags.interactive || !hasAnyDataFlags(flags)
      ? await buildPayloadInteractively()
      : buildPayloadFromFlags(flags);

  await submitCheckin(payload, flags);
};

await main().catch((error) => {
  console.error(`\n❌ ${error instanceof Error ? error.message : "Unexpected error"}\n`);
  console.log(usageText);
  process.exit(1);
});
