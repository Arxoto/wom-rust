peg::parser!(grammar arithmetic() for str {
    pub rule expression() -> f64
        = _ v:add_subtract() _ { v }
    #[cache_left_rec]
    rule add_subtract() -> f64
        = l:add_subtract() _ "+" _ r:multiply_divide() { l + r }
        / l:add_subtract() _ "-" _ r:multiply_divide() { l - r }
        / multiply_divide()
    #[cache_left_rec]
    rule multiply_divide() -> f64
        = l:multiply_divide() _ "*" _ r:power() { l * r }
        / l:multiply_divide() _ "/" _ r:power() { l / r }
        / l:multiply_divide() _ "%" _ r:power() { l % r }
        / power()
    #[cache_left_rec]
    rule power() -> f64
        = l:power() _ "^" _ r:sub_expression() { l.powf(r) }
        / sub_expression()
    rule sub_expression() -> f64
        = "(" _ v:add_subtract() _ ")" { v }
        / number()
    rule number() -> f64
        = n:$("-"? ['0'..='9']+ ("." ['0'..='9']+)?) { n.parse::<f64>().unwrap() }
    rule _ = " "*
});

#[tauri::command]
pub fn calc(expr: String) -> Result<f64, String> {
    arithmetic::expression(&expr).map_err(|_| "not_expression".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_err() {
        let x: Result<i32, i32> = Ok(3);
        assert_eq!(x.map_err(|_| "err".to_string()), Ok(3));
        let x: Result<i32, i32> = Err(3);
        assert_eq!(x.map_err(|_| "err".to_string()), Err("err".to_string()));
    }

    #[test]
    fn test_number() {
        assert_eq!(arithmetic::expression(" -1.55 "), Ok(-1.55));
        assert_eq!(arithmetic::expression("2.55 "), Ok(2.55));
        assert!(arithmetic::expression(" --1.0").is_err());
        // sub
        assert!(arithmetic::expression(" -(-1.0)").is_err());
        assert_eq!(arithmetic::expression("0 -(-1.0)"), Ok(1.0));
    }

    #[test]
    fn test_add_subtract() {
        assert_eq!(arithmetic::expression("5-3+1"), Ok(3.0));
        assert_eq!(arithmetic::expression("5 + 3+11"), Ok(19.0));
        assert_eq!(arithmetic::expression("5 + -6 -3+11"), Ok(7.0));
        assert_eq!(arithmetic::expression("5-3-3+1-2+3-4-5+6+7"), Ok(5.0));
        // sub
        assert_eq!(
            arithmetic::expression("5-3-((3+1-2)+3-(4-5+7))+7"),
            Ok(10.0)
        );
    }

    #[test]
    fn test_multiply_divide() {
        // println!("{}", 65.9%8.1);
        assert_eq!(arithmetic::expression("2*3"), Ok(6.0));
        assert_eq!(arithmetic::expression("2/2*3"), Ok(3.0));
        assert_eq!(arithmetic::expression("2%3"), Ok(2.0));
        assert_eq!(arithmetic::expression("3 % 2"), Ok(1.0));
        assert_eq!(arithmetic::expression("2*3/2"), Ok(3.0));
        assert_eq!(arithmetic::expression("3/2*2"), Ok(3.0));
        assert_eq!(arithmetic::expression("3/2 + 3/4 + 3/8 + 3/8"), Ok(3.0));
        assert_eq!(arithmetic::expression("3/2/3/5*2 + 1"), Ok(1.2));
        // sub
        assert_eq!(arithmetic::expression("3/(3/2)/(5*2 -2)"), Ok(0.25));
        assert_eq!(arithmetic::expression("3/(3/2)/(5%2 -2)"), Ok(-2.0));
    }

    #[test]
    fn test_power() {
        // println!("{}", 2.0f64.powf(2.0));
        assert_eq!(arithmetic::expression("2^3"), Ok(8.0));
        assert_eq!(arithmetic::expression("2^2+1"), Ok(5.0));
        assert_eq!(arithmetic::expression("2^2*3"), Ok(12.0));
        assert_eq!(arithmetic::expression("2*3^2 / 3 + 1"), Ok(7.0));
        // sub
        assert_eq!(arithmetic::expression("2*3^ (1 + 2^3%6)"), Ok(54.0));
    }
}
